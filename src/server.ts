import { Server as HttpServer } from "http";

import express from "@/express";

export default class Server {
  private static get port(): string {
    return process.env.PORT || "3000";
  }

  private static setDefaultEnvironmentVariables() {
    process.env.KEYCLOAK_DOTBASE_REALM_NAME = process.env.KEYCLOAK_DOTBASE_REALM_NAME ?? "dotbase";
    process.env.KEYCLOAK_DOTBASE_REALM_CLIENT_ID =
      process.env.KEYCLOAK_DOTBASE_REALM_CLIENT_ID ?? "authentication-gateway";

    process.env.KEYCLOAK_PATIENT_REALM_NAME = process.env.KEYCLOAK_PATIENT_REALM_NAME ?? "patients";
    process.env.KEYCLOAK_PATIENT_REALM_CLIENT_ID =
      process.env.KEYCLOAK_PATIENT_REALM_CLIENT_ID ?? "authentication-gateway";
  }

  private static validateEnvironmentVariables() {
    const requiredEnvVariables = [
      "KEYCLOAK_DOTBASE_REALM_CLIENT_SECRET",
      "DOTBASE_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES",
      "KEYCLOAK_PATIENT_REALM_CLIENT_SECRET",
      "PATIENT_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES",
    ];
    for (const envVariable of requiredEnvVariables) {
      if (!process.env[envVariable])
        throw new Error(
          `Environment variable ${envVariable} is unset, but required for the service to work.`
        );
    }
  }

  constructor() {
    this.startApiServer();
  }

  private async startApiServer() {
    Server.setDefaultEnvironmentVariables();
    Server.validateEnvironmentVariables();

    const server = express.listen(Server.port, () => {
      console.log(`Server listening on ${Server.port}`);
    });

    process.on("SIGTERM", () => this.shutdownApiServer(server));
    process.on("SIGINT", () => this.shutdownApiServer(server));
  }

  private async shutdownApiServer(server: HttpServer) {
    server.close(() => {
      console.log("Server has gracefully shut down");
    });
  }
}

new Server();
