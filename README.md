# Authentication Gateway
Authentication Gateway for dot-base to manage user authentication and registration using session cookies.

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dot-base/authentication-gateway)](https://github.com/dot-base/authentication-gateway/releases)
[![Docker Build Status](https://img.shields.io/badge/We%20love-Docker-blue?style=flat&logo=Docker)](https://github.com/orgs/dot-base/packages)


## Quick Nav
1. [Usage](#Usage)
1. [Configuration](#Configuration)
1. [Contributing](#Contributing)


## Usage

Want a authentication gateway of your own? The easiest way is to deploy our docker container. Just follow the steps below to get started.

### Requirements
- [Docker Engine >= v1.13](https://www.docker.com/get-started)

### Deployment
1. Set environment variables to configure the container:
    ```sh
    export KEYCLOAK_DOTBASE_REALM_NAME="dotbase"
    export KEYCLOAK_DOTBASE_REALM_CLIENT_ID="YOUR-CLIENT-ID"
    export KEYCLOAK_DOTBASE_REALM_CLIENT_SECRET="YOUR-CLIENT-SECRET"
    export DOTBASE_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES="YOUR-SECRET-TO-ENCRYPT-THE-SESSION-COOKIE"

    export KEYCLOAK_PATIENT_REALM_NAME="patients"
    export KEYCLOAK_PATIENT_REALM_CLIENT_ID="YOUR-CLIENT-ID"
    export KEYCLOAK_PATIENT_REALM_CLIENT_SECRET="YOUR-CLIENT-SECRET"
    export PATIENT_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES="YOUR-SECRET-TO-ENCRYPT-THE-SESSION-COOKIE"

    ```
1. Start the container
    ```
    docker run --name authentication-gateway -e KEYCLOAK_DOTBASE_REALM_NAME -e KEYCLOAK_DOTBASE_REALM_CLIENT_ID -e KEYCLOAK_DOTBASE_REALM_CLIENT_SECRET -e DOTBASE_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES -e KEYCLOAK_PATIENT_REALM_NAME -e KEYCLOAK_PATIENT_REALM_CLIENT_ID -e KEYCLOAK_PATIENT_REALM_CLIENT_SECRET -e PATIENT_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES -p 3000:3000 -d ghcr.io/dot-base/authentication-gateway:latest
    ```
1. Done and dusted 🎉. The Server is available on port 3000.


## Configuration

### Identity Provider Connection
| Variable Name | Default | Example |
| --- | --- | --- |
| KEYCLOAK_SERVER_ADDRESS | http://keycloak:8080 | - |
| KEYCLOAK_DOTBASE_REALM_NAME | - | dotbase |
| KEYCLOAK_DOTBASE_REALM_CLIENT_ID | - | authentication-gateway |
| KEYCLOAK_DOTBASE_REALM_CLIENT_SECRET | - | - |
| KEYCLOAK_PATIENT_REALM_NAME | - | patients |
| KEYCLOAK_PATIENT_REALM_CLIENT_ID | - | authentication-gateway |
| KEYCLOAK_PATIENT_REALM_CLIENT_SECRET | - | - |

### Encryption
Used to encrypt the token cookie before sending it to the client
| Variable Name | Default | Example |
| --- | --- | --- |
| DOTBASE_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES | - | - |
| PATIENT_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES | - | - |

## Contributing

This project is written in Typescript. For an introduction into the language and best practices see the [typescript documentation](https://www.typescriptlang.org/docs/home.html).

### Requirements
- [Node.js >= v16](https://nodejs.org/en/)
- A local copy of this repository

### Running Locally
1. Set up a keycloak instance:
    1. Start a keycloak server
        ```sh
        docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin quay.io/keycloak/keycloak:15.0.2
        ```
    1. Create a new realm
    1. Create a new client
        1. Set the client "Access Type" to "confidential"
        1. Set the "Valid Redirect URIs" to "http://127.0.0.1:8080/"
    1. Create user with password
1. Install all dependencies
    ```
    npm install
    ```
1. Set environment variables to configure the application:
    ```sh  
    export KEYCLOAK_DOTBASE_REALM_NAME="dotbase"
    export KEYCLOAK_DOTBASE_REALM_CLIENT_ID="YOUR-CLIENT-ID"
    export KEYCLOAK_DOTBASE_REALM_CLIENT_SECRET="YOUR-CLIENT-SECRET"
    export DOTBASE_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES="YOUR-SECRET-TO-ENCRYPT-THE-SESSION-COOKIE"

    export KEYCLOAK_PATIENT_REALM_NAME="patients"
    export KEYCLOAK_PATIENT_REALM_CLIENT_ID="YOUR-CLIENT-ID"
    export KEYCLOAK_PATIENT_REALM_CLIENT_SECRET="YOUR-CLIENT-SECRET"
    export PATIENT_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES="YOUR-SECRET-TO-ENCRYPT-THE-SESSION-COOKIE"
    ```
1. Start the development server
    ```
    npm start
    ```
1. After some startup the server will be available at http://localhost:3000.
1. Go and mix up some code 👩‍💻. The server will reload automatically once you save. Remember to keep an eye on the console.

