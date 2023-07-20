# HTTP Auth Shield

HTTP Auth Shield is a simple, lightweight Node.js proxy server that protects an HTTP service with a single username/password authentication layer. It's perfect for shielding development environments or internal services with a basic authentication layer.

The server uses Express.js for handling requests and an HTTP proxy middleware to forward authenticated requests to the destination server.

## Docker Environment Variables

You must provide the following environment variables when running the HTTP Auth Shield Docker container:

- `LOGIN_USER` - The username for the login form (Example: `user`)
- `LOGIN_PASS` - The password for the login form (Example: `pass`)
- `PROXY_DST` - The destination for the HTTP proxy (Example: `http://example.com:80`)

The following environment variables can be provided optionally:
- `PORT` - The port where the server should listen (Default: `3000`)
- `TITLE` - The title shown above the login form (Default: `HTTP Auth Shield`)

## Usage

You can pull the Docker image from GitHub Packages:

```
docker pull ghcr.io/sipefree/http-auth-shield:latest
```


### Running with Docker CLI

Here's an example of running HTTP Auth Shield from the Docker command line:

```bash
docker run -d -p 3000:3000 --env TITLE=Login --env LOGIN_USER=user --env LOGIN_PASS=pass --env PROXY_DST=http://example.com:80 --env PORT=3000 --name http-auth-shield ghcr.io/sipefree/http-auth-shield:latest
```

### Running with Docker Compose

Here's an example of how you can use HTTP Auth Shield with Docker Compose:

```yml
version: '3'
services:
  http-auth-shield:
    image: ghcr.io/sipefree/http-auth-shield:latest
    ports:
      - 3000:3000
    environment:
      TITLE: Login
      LOGIN_USER: user
      LOGIN_PASS: pass
      PROXY_DST: http://example.com:80
      PORT: 3000
```

You can run the service with `docker-compose up -d`.

### License

This project is open source and available under the MIT License.