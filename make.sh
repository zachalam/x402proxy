#!/bin/bash

# Clean up existing x402-rs directory if it exists
[ -d "x402-rs" ] && rm -rf x402-rs

# Function to check if a command is available
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "❌ Error: $1 is not installed or not available in PATH"
        echo "Please install $1 and ensure it's available in your PATH before running this script."
        exit 1
    else
        echo "✅ $1 is available"
    fi
}

# Check for required programs
echo "Checking for required programs..."
check_command "git"
check_command "docker"

echo ""
echo "All required programs are available."

# Check for .env file
echo "Checking for .env file..."
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found in the current directory"
    echo "Please create a .env file with the required environment variables before running this script. A .env.example file is provided."
    exit 1
else
    echo "✅ .env file found"
fi

echo ""
echo "All checks passed. Proceeding with the operation..."
echo ""

# setup x402-rs | specific instructions for v0.7.9
git clone https://github.com/x402-rs/x402-rs
cd x402-rs
git checkout v0.7.9    
cp ../.copy.x402rs ./.env    
cd ..

# setup and run both services with docker-compose
echo "Starting services with Docker Compose..."
docker-compose up -d