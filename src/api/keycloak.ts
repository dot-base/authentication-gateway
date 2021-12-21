import fetch, { BodyInit } from "node-fetch";

import KeycloakCerts from "@/types/KeycloakCerts";
import Tokens from "@/types/Tokens";
import RealmConfig from "@/types/RealmConfig";

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
    if (!response.ok) throw new Error("Unable to login.");

    return response.json();
  }

  public static async certificates(realm: RealmConfig): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/${realm.realmName}/protocol/openid-connect/certs`
    );

    if (!response.ok)
      throw new Error(
        `Unable to fetch certificates from keycloak server. Server responded with HTTP ${response.status}.`
      );

    const certsJson = (await response.json()) as KeycloakCerts;
    return certsJson.keys.flatMap((key) => key.x5c);
  }

  public static async setupTOTP(patientId: string): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/${RealmsUtil.patientRealmName}/totp/setup/${patientId}`
    );

    if (!response.ok)
      throw new Error(
        `Unable to fetch OTP setup from keycloak server. Server responded with HTTP ${response.status}.`
      );

    return await response.text();
  }
}
