# Authentication Gateway
Traefik forward auth implementation to manage user authentication and registration using session cookies.

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dot-base/authentication-gateway)](https://github.com/dot-base/authentication-gateway/releases)
[![Docker Build Status](https://img.shields.io/badge/We%20love-Docker-blue?style=flat&logo=Docker)](https://github.com/orgs/dot-base/packages)


## Quick Nav
1. [Usage](#Usage)
1. [Configuration](#Configuration)
1. [Contributing](#Contributing)


## Usage

Want a Traefik JWT Auth of your own? The easiest way is to deploy our docker container. Just follow the steps below to get started.


### Requirements
- [Docker Engine >= v1.13](https://www.docker.com/get-started)

### Deployment
1. [optional] Set environment variables to configure the container:
    ```sh
    export KEYCLOAK_REALM_URL=http://keycloak:8080/auth/realms/dotbase
    ```
1. Start the container
    ```
    docker run --name authentication-gateway -p 3000:3000 -d ghcr.io/dot-base/authentication-gateway:latest
    ```
1. Done and dusted 🎉. The Server is available on port 3000.


## Configuration

### Identity Provider Connection
| Variable Name | Default | Example |
| --- | --- | --- |
| KEYCLOAK_CLIENT_ID | - | authentication-gateway |
| KEYCLOAK_CLIENT_SECRET | - | - |

### Encryption
| Variable Name | Default | Example |
| --- | --- | --- |
| AES_PASSPHRASE | - | - |


## Contributing

This project is written in Typescript. For an introduction into the language and best practices see the [typescript documentation](https://www.typescriptlang.org/docs/home.html).

### Requirements
- [Node.js >= v16](https://nodejs.org/en/)
- A local copy of this repository

### Running Locally
1. Install all dependencies
    ```
    npm install
    ```
1. Set the environment variables:
    ```
    export KEYCLOAK_REALM_URL=http://127.0.0.1:8080/auth/realms/dotbase
    ```
1. Start the development server
    ```
    npm start
    ```
1. After some startup the server will be available at http://localhost:3000.
1. Go and mix up some code 👩‍💻. The server will reload automatically once you save. Remember to keep an eye on the console.

