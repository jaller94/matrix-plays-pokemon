FROM node:18-slim

WORKDIR "/app"

# Install app dependencies
COPY . /app/
RUN npm install

CMD ["npm", "run", "start"]
