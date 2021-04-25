FROM node:14

WORKDIR /usr/src/app

# Add package file
COPY package*.json ./

# Install deps
RUN npm ci

COPY . .

# Expose port 3000
EXPOSE 3000
