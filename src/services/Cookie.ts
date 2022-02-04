import KeycloakApi from "@/api/Keycloak";
import RealmFactory from "@/models/RealmFactory";
import CryptoService from "@/services/Crypto";
import Cookie from "@/types/Cookie";
import RealmConfig from "@/types/RealmConfig";
import TokenIntrospection from "@/types/TokenIntrospection";
import Tokens from "@/types/Tokens";
import UserInfo from "@/types/UserInfo";
import JwtUtil from "@/utils/Jwt";

export default class CookieService {
  private static createCookieFromToken(realm: RealmConfig, tokens: Tokens) {
    return {
      value: CryptoService.encrypt(realm, tokens),
      options: {
        expires: new Date(Date.now() + tokens.refresh_expires_in * 1000),
        httpOnly: true,
      },
    };
  }
  public static async createSessionCookie(
    realm: RealmConfig,
    username: string,
    password: string
  ): Promise<Cookie> {
    const tokens = await KeycloakApi.login(realm, username, password);
    return this.createCookieFromToken(realm, tokens);
  }

  public static async validateCookieExpiration(sessionCookie: string): Promise<boolean> {
    const tokens = CryptoService.decrypt(sessionCookie);
    return JwtUtil.isExpired(tokens.access_token);
  }

  public static async validateSessionCookie(sessionCookie: string): Promise<TokenIntrospection> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const realmName = JwtUtil.getRealmName(tokens);
    const realm = RealmFactory.realm(realmName);

    const inspectedToken = await KeycloakApi.validate(realm, tokens);
    if (!inspectedToken.active) throw new Error("Access token is invalid.");

    return inspectedToken;
  }

  public static async renewSessionCookie(sessionCookie: string): Promise<Cookie> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const realmName = JwtUtil.getRealmName(tokens);
    const realm = RealmFactory.realm(realmName);

    const newTokens = await KeycloakApi.refresh(realm, tokens.refresh_token);
    return this.createCookieFromToken(realm, newTokens);
  }

  public static async invalidateSessionCookie(sessionCookie: string): Promise<void> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const realmName = JwtUtil.getRealmName(tokens);
    const realm = RealmFactory.realm(realmName);
    await KeycloakApi.logout(realm, tokens.refresh_token);
  }

  public static async getUserInfo(sessionCookie: string): Promise<UserInfo> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const realmName = JwtUtil.getRealmName(tokens);
    const realm = RealmFactory.realm(realmName);
    return await KeycloakApi.userInfo(realm, tokens);
  }
}
