# We are using a Node.js 14 image from DockerHub
FROM node:20.4.0-alpine3.18

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install the dependencies in the package.json
RUN npm install

# If you are building your code for production, run `npm ci --only=production`
# RUN npm ci --only=production

# Copy the rest of the application to the working directory
COPY . .

ENV LOGIN_USER=user
ENV LOGIN_PASS=pass
ENV PROXY_DST=http://example.com:80
ENV PORT=3000

# The application listens on port 3000, so let's expose it
EXPOSE ${PORT}

# This command starts our application
CMD [ "npm", "start" ]
