FROM node:20-bookworm

RUN npx playwright install --with-deps chromium


ENV EMAIL=bahaddou@proton.me
ENV PASSWORD=s8W@@yzAAPFyEHu
ENV BOTTOKEN=MTI3NjYzMjY5MjUxNTE0Nzg3Ng.GVk_5L.D_AHJCioDWHsJPtkebMmfaN-oZB6i3Z0MdaS70
WORKDIR /app

# Copy your application files into the container
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the port your app runs on (if applicable)
EXPOSE 3000

# Start the application (replace with your actual start command)
CMD ["npm", "run", "start"]
