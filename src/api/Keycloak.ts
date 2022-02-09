import fetch, { BodyInit } from "node-fetch";

import Tokens from "@/types/Tokens";
import RealmConfig from "@/types/RealmConfig";
import TokenIntrospection from "@/types/TokenIntrospection";
import TOTPConfig from "@/types/TOTPConfig";
import UserInfo from "@/types/UserInfo";
import HTTPError from "@/utils/HTTPError";

export default abstract class KeycloakApi {
  private static get serverAddress(): string {
    return process.env.KEYCLOAK_SERVER_ADDRESS ?? "http://keycloak:8080";
  }

  private static loginParams(
    realm: RealmConfig,
    username: string,
    password: string
  ): URLSearchParams {
    const loginParams = new URLSearchParams();
    loginParams.append("client_id", realm.clientId);
    loginParams.append("client_secret", realm.clientSecret);
    loginParams.append("grant_type", "password");
    loginParams.append("username", username);

    if (realm.realmName === process.env.KEYCLOAK_PATIENT_REALM_NAME) {
      loginParams.append("otp", password);
    } else {
      loginParams.append("password", password);
    }
    return loginParams;
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
    const loginParams = this.loginParams(realm, username, password);
    const response = await fetch(
      `${this.baseUrl}/${realm.realmName}/protocol/openid-connect/token`,
      {
        method: "POST",
        body: loginParams as unknown as BodyInit,
      }
    );
    if (!response.ok) throw new HTTPError(`Unable to login. Server responded with HTTP ${response.status}.`, 401);

    return response.json();
  }

  public static async logout(realm: RealmConfig, refreshToken: string): Promise<void> {
    const logoutParams = new URLSearchParams();
    logoutParams.append("client_id", realm.clientId);
    logoutParams.append("client_secret", realm.clientSecret);
    logoutParams.append("refresh_token", refreshToken);

    const response = await fetch(
      `${this.baseUrl}/${realm.realmName}/protocol/openid-connect/logout`,
      {
        method: "POST",
        body: logoutParams as unknown as BodyInit,
      }
    );
    if (!response.ok) throw new HTTPError(`Unable to logout. Server responded with HTTP ${response.status}.`, 500);
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
    if (!response.ok) throw new HTTPError(`Unable to refresh token. Server responded with HTTP ${response.status}.`, 500);

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
    if (!response.ok) throw new HTTPError(`Unable to validate token. Server responded with HTTP ${response.status}.`, 401);

    return response.json();
  }

  public static async userInfo(realm: RealmConfig, tokens: Tokens): Promise<UserInfo> {
    const response = await fetch(
      `${this.baseUrl}/${realm.realmName}/protocol/openid-connect/userinfo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );
    if (!response.ok) throw new HTTPError(`Unable to get userinfo. Server responded with HTTP ${response.status}.`, 500);

    return response.json();
  }

  public static async setupTOTP(realm: RealmConfig, username: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/${realm.realmName}/totp/setup/${username}`);

    if (!response.ok)
      throw new HTTPError(
        `Unable to fetch OTP setup from keycloak server. Server responded with HTTP ${response.status}.`, 500
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
      throw new HTTPError(
        `Unable to register device at keycloak server for OTP setup. Server responded with HTTP ${response.status}.`, 500
      );
  }
}
