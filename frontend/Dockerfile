FROM node:20-slim

# Install basic dependencies needed for some npm packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm ci --quiet

# Copy the rest of the application
COPY . .

EXPOSE 3005

# CMD to start development server
CMD ["sh", "-lc", "rm -rf /app/.next/* && npm run dev -- -H 0.0.0.0 -p 3005"]
