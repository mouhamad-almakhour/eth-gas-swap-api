FROM node:22.19-alpine

WORKDIR /backend

# Copy package.json and lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build project
RUN npx nest build

# Expose port
EXPOSE 3000

# Run app
CMD ["node", "dist/main.js"]
