FROM node:20-slim

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm ci --quiet

# Copy the rest of the application
COPY . .

EXPOSE 3005

# CMD to start development server
CMD ["sh", "-lc", "rm -rf /app/.next/* && npm run dev -- -H 0.0.0.0 -p 3005"]
