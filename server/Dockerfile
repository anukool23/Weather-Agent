# Use Node.js base image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 3000 inside the container
EXPOSE 3000

# Run the server
CMD [ "node", "server.js" ]
