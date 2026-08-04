"""
Gemini API Proxy — runs on Windows host, forwards requests from Docker containers
to the Gemini API (or any OpenAI-compatible API) since Docker's DNS is broken.

Usage:
    python gemini_proxy.py

Listens on: http://0.0.0.0:11435
Docker containers reach it via: http://host.docker.internal:11435

Set in backend/.env:
    AI_BASE_URL=http://host.docker.internal:11435/v1
"""

import sys
import json
import urllib.request
import urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler

# ── CONFIGURE THESE ────────────────────────────────────────────────────────────
PROXY_PORT = 11435
TARGET_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai"
# ──────────────────────────────────────────────────────────────────────────────


class ProxyHandler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        # Compact logging
        print(f"[proxy] {self.command} {self.path} → {args[1] if len(args) > 1 else '?'}")

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_POST(self):
        # Read request body
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length else b""

        # Build upstream URL
        upstream_url = TARGET_BASE_URL.rstrip("/") + self.path

        # Forward Authorization header
        auth = self.headers.get("Authorization", "")

        try:
            req = urllib.request.Request(
                upstream_url,
                data=body,
                method="POST",
            )
            req.add_header("Content-Type", self.headers.get("Content-Type", "application/json"))
            req.add_header("Authorization", auth)

            with urllib.request.urlopen(req, timeout=120) as resp:
                resp_body = resp.read()
                self.send_response(resp.status)
                self._cors_headers()
                self.send_header("Content-Type", resp.headers.get("Content-Type", "application/json"))
                self.end_headers()
                self.wfile.write(resp_body)

        except urllib.error.HTTPError as e:
            err_body = e.read()
            self.send_response(e.code)
            self._cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(err_body)

        except Exception as e:
            error = json.dumps({"error": str(e)}).encode()
            self.send_response(502)
            self._cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(error)

    def do_GET(self):
        upstream_url = TARGET_BASE_URL.rstrip("/") + self.path
        try:
            req = urllib.request.Request(upstream_url)
            req.add_header("Authorization", self.headers.get("Authorization", ""))
            with urllib.request.urlopen(req, timeout=30) as resp:
                resp_body = resp.read()
                self.send_response(resp.status)
                self._cors_headers()
                self.end_headers()
                self.wfile.write(resp_body)
        except Exception as e:
            self.send_response(502)
            self._cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def _cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PROXY_PORT), ProxyHandler)
    print(f"✅ Gemini Proxy running on http://0.0.0.0:{PROXY_PORT}")
    print(f"   Forwarding to: {TARGET_BASE_URL}")
    print(f"   Docker containers use: http://host.docker.internal:{PROXY_PORT}/v1")
    print(f"\n   In backend/.env set:")
    print(f"   AI_BASE_URL=http://host.docker.internal:{PROXY_PORT}/v1\n")
    print("   Press Ctrl+C to stop.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nProxy stopped.")
        sys.exit(0)
