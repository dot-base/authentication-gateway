import Tokens from "@/types/Tokens";
import fetch, { BodyInit } from "node-fetch";

export default class KeycloakApi {
  private static get serverAddress(): string {
    return process.env.KEYCLOAK_SERVER_ADDRESS ?? "http://keycloak:8080";
  }

  private static get realmName(): string {
    if (!process.env.KEYCLOAK_REALM_NAME) throw new Error("Keycloak realm name is not defined.");
    return process.env.KEYCLOAK_REALM_NAME;
  }

  private static get clientId(): string {
    if (!process.env.KEYCLOAK_CLIENT_ID) throw new Error("Keycloak client ID is not defined.");
    return process.env.KEYCLOAK_CLIENT_ID;
  }

  private static get clientSecret(): string {
    if (!process.env.KEYCLOAK_CLIENT_SECRET)
      throw new Error("Keycloak client secret is not defined.");
    return process.env.KEYCLOAK_CLIENT_SECRET;
  }

  private static get baseUrl(): string {
    const hostname =
      process.env.NODE_ENV === "development" ? "http://127.0.0.1:8080" : this.serverAddress;

    return new URL(`/auth/realms/${this.realmName}`, hostname).toString();
  }

  public static async login(username: string, password: string): Promise<Tokens> {
    const loginParams = new URLSearchParams();
    loginParams.append("client_id", this.clientId);
    loginParams.append("client_secret", this.clientSecret);
    loginParams.append("grant_type", "password");
    loginParams.append("username", username);
    loginParams.append("password", password);

    const response = await fetch(`${this.baseUrl}/protocol/openid-connect/token`, {
      method: "POST",
      body: loginParams as unknown as BodyInit,
    });
    if (!response.ok) throw new Error("Unable to login.");

    return response.json();
  }
}
