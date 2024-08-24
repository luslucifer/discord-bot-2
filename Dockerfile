FROM node:20-bookworm

RUN npx -y playwright@1.46.1 install --with-deps

WORKDIR /app

# Copy your application files into the container
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the port your app runs on (if applicable)
EXPOSE 3000

# Start the application (replace with your actual start command)
CMD ["npm", "run", "test"]
