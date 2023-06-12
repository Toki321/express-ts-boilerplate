#!/bin/bash

# Pull the latest changes from the Git repository
echo "Pulling the latest changes from Git..."
git pull

# Install dependencies
echo "Installing dependencies..."
npm install

# Stop the pm2 process
echo "Stopping the pm2 process..."
pm2 stop rest-api-express

# Build and Start the pm2 process
echo "Building app and starting the pm2 process..."
npm run start:prod

# Save the pm2 process list to ensure it's restarted automatically on server reboot
echo "Saving the pm2 process list..."
pm2 save

echo "Deployment complete!"
