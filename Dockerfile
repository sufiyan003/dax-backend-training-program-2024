# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose the port the application runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

# docker run -p 4000:3000 my-node-app
