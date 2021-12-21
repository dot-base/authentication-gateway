import fetch, { BodyInit } from "node-fetch";

import KeycloakCerts from "@/types/KeycloakCerts";
import Tokens from "@/types/Tokens";
import realmConfig from "@/types/RealmConfig";
import PatientRealm from "../utils/realmConfig/patientRealm";
import DotbaseRealm from "../utils/realmConfig/dotbaseRealm";
import PatientRealmConfig from "../utils/realmConfig/patientRealm";
import DotbaseRealmConfig from "../utils/realmConfig/dotbaseRealm";

export default abstract class KeycloakApi {
  private static get serverAddress(): string {
    return process.env.KEYCLOAK_SERVER_ADDRESS ?? "http://keycloak:8080";
  }

  private static realmConfig(realmName: string): realmConfig {
    switch(realmName) {
      case process.env.KEYCLOAK_PATIENT_REALM_NAME:
        return new PatientRealmConfig();
      case process.env.KEYCLOAK_DOTBASE_REALM_NAME:
        return new DotbaseRealmConfig();
      default:
        throw new Error("Keycloak realm name is not defined.");
    }
  }

  public static get baseUrl(): string {
    const hostname =
      process.env.NODE_ENV === "development" ? "http://127.0.0.1:8080" : this.serverAddress;

    return new URL(`/auth/realms`, hostname).toString();
  }

  public static async login(realmName:string, username: string, password: string): Promise<Tokens> {
    const realmConfig = this.realmConfig(realmName);
    const loginParams = new URLSearchParams();
    loginParams.append("client_id", realmConfig.clientId);
    loginParams.append("client_secret", realmConfig.clientSecret);
    loginParams.append("grant_type", "password");
    loginParams.append("username", username);
    loginParams.append("password", password);

    const response = await fetch(`${this.baseUrl}/${realmConfig.realmName}/protocol/openid-connect/token`, {
      method: "POST",
      body: loginParams as unknown as BodyInit,
    });
    if (!response.ok) throw new Error("Unable to login.");

    return response.json();
  }

  public static async refresh(realmName:string, refreshToken: string): Promise<Tokens> {
    const realmConfig = this.realmConfig(realmName);
    const loginParams = new URLSearchParams();
    loginParams.append("client_id", realmConfig.clientId);
    loginParams.append("client_secret", realmConfig.clientSecret);
    loginParams.append("grant_type", "refresh_token");
    loginParams.append("refresh_token", refreshToken);

    const response = await fetch(`${this.baseUrl}/${realmConfig.realmName}/protocol/openid-connect/token`, {
      method: "POST",
      body: loginParams as unknown as BodyInit,
    });
    if (!response.ok) throw new Error("Unable to login.");

    return response.json();
  }

  public static async certificates(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/protocol/openid-connect/certs`);

    if (!response.ok)
      throw new Error(
        `Unable to fetch certificates from keycloak server. Server responded with HTTP ${response.status}.`
      );

    const certsJson = (await response.json()) as KeycloakCerts;
    return certsJson.keys.flatMap((key) => key.x5c);
  }
}
