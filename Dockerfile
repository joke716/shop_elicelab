###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Change ownership to node user
RUN chown -R node:node /usr/src/app

# Copy dependency manifests first
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm install --force

# Copy application source
COPY --chown=node:node . .

# ✅ Ensure the `dist` directory exists and grant correct permissions
RUN mkdir -p /usr/src/app/dist && chown -R node:node /usr/src/app/dist

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Ensure correct permissions for `dist` folder
RUN chown -R node:node /usr/src/app/dist

# Install production dependencies
RUN npm install --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

WORKDIR /usr/src/app

# Copy from build stage
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Ensure correct permissions for `dist`
RUN chown -R node:node /usr/src/app/dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]