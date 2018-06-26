# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:9.3.0

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL all

# Copy all local files into the image.
COPY . .

# Install dependencies
RUN yarn

# Run
CMD yarn run start-prod

# Tell Docker about the port we'll run on.
EXPOSE 7000
