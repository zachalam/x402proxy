# Use the official Node.js runtime as the base image (includes Python 3.11.2)
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json .

# Install any dependencies (none in this case, but good practice)
RUN npm install

# Copy the rest of the application code
COPY server.js settings.json ./

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "dev"]
