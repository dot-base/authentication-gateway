import fetch, { BodyInit } from "node-fetch";

import Tokens from "@/types/Tokens";
import RealmConfig from "@/types/RealmConfig";
import TokenIntrospection from "@/types/TokenIntrospection";
import TOTPConfig from "@/types/TOTPConfig";

export default abstract class KeycloakApi {
  private static get serverAddress(): string {
    return process.env.KEYCLOAK_SERVER_ADDRESS ?? "http://keycloak:8080";
  }

  public static get baseUrl(): string {
    const hostname =
      process.env.NODE_ENV === "development" ? "http://127.0.0.1:8080" : this.serverAddress;

    return new URL(`/auth/realms`, hostname).toString();
  }

  public static async login(
    realm: RealmConfig,
    username: string,
    password: string
  ): Promise<Tokens> {
    const loginParams = new URLSearchParams();
    loginParams.append("client_id", realm.clientId);
    loginParams.append("client_secret", realm.clientSecret);
    loginParams.append("grant_type", "password");
    loginParams.append("username", username);
    loginParams.append("password", password);

    const response = await fetch(
      `${this.baseUrl}/${realm.realmName}/protocol/openid-connect/token`,
      {
        method: "POST",
        body: loginParams as unknown as BodyInit,
      }
    );
    if (!response.ok) throw new Error("Unable to login.");

    return response.json();
  }

  public static async refresh(realm: RealmConfig, refreshToken: string): Promise<Tokens> {
    const loginParams = new URLSearchParams();
    loginParams.append("client_id", realm.clientId);
    loginParams.append("client_secret", realm.clientSecret);
    loginParams.append("grant_type", "refresh_token");
    loginParams.append("refresh_token", refreshToken);

    const response = await fetch(
      `${this.baseUrl}/${realm.realmName}/protocol/openid-connect/token`,
      {
        method: "POST",
        body: loginParams as unknown as BodyInit,
      }
    );
    if (!response.ok) throw new Error("Unable to refresh token.");

    return response.json();
  }

  public static async validate(realm: RealmConfig, tokens: Tokens): Promise<TokenIntrospection> {
    const loginParams = new URLSearchParams();
    loginParams.append("client_id", realm.clientId);
    loginParams.append("client_secret", realm.clientSecret);
    loginParams.append("token", tokens.access_token);

    const response = await fetch(
      `${this.baseUrl}/${realm.realmName}/protocol/openid-connect/token/introspect`,
      {
        method: "POST",
        body: loginParams as unknown as BodyInit,
      }
    );
    if (!response.ok) throw new Error("Unable to validate token.");

    return response.json();
  }

  public static async setupTOTP(realm: RealmConfig, username: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/${realm.realmName}/totp/setup/${username}`);

    if (!response.ok)
      throw new Error(
        `Unable to fetch OTP setup from keycloak server. Server responded with HTTP ${response.status}.`
      );

    return await response.text();
  }

  public static async registerDevice(
    totpConfig: TOTPConfig,
    realm: RealmConfig,
    username: string
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${realm.realmName}/totp/device/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(totpConfig),
    });

    if (!response.ok)
      throw new Error(
        `Unable to register device at keycloak server for OTP setup. Server responded with HTTP ${response.status}.`
      );
  }
}
