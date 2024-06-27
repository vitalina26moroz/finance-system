# Use Node.js as the base image
FROM node:lts

RUN apt-get update && apt-get install -y make gcc g++ python3 cmake
# Set the working directory inside the container
WORKDIR /appvita

# Copy the root package.json and package-lock.json files
COPY ./package.json /appvita

# Install dependencies
RUN npm install

# Copy the application code and build output
COPY ./dist/apps/personal-finance-management-system/*.js /appvita

# Install the 'aws-lambda-ric' for lambda support
RUN npm install -g aws-lambda-ric

# Command to start the Lambda function
CMD ["aws-lambda-ric", "main.handler"]
