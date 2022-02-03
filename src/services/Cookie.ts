import KeycloakApi from "@/api/Keycloak";
import RealmFactory from "@/models/RealmFactory";
import CryptoService from "@/services/Crypto";
import RealmConfig from "@/types/RealmConfig";
import TokenIntrospection from "@/types/TokenIntrospection";
import UserInfo from "@/types/UserInfo";
import JwtUtil from "@/utils/Jwt";

export default class CookieService {
  public static async createSessionCookie(
    realm: RealmConfig,
    username: string,
    password: string
  ): Promise<string> {
    const tokens = await KeycloakApi.login(realm, username, password);
    return CryptoService.encrypt(realm, tokens);
  }

  public static async renewSessionCookie(
    realm: RealmConfig,
    sessionCookie: string
  ): Promise<string> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const newTokens = await KeycloakApi.refresh(realm, tokens.refresh_token);
    return CryptoService.encrypt(realm, newTokens);
  }

  public static async validateSessionCookie(sessionCookie: string): Promise<TokenIntrospection> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const realmName = JwtUtil.getRealmName(tokens);
    const realm = RealmFactory.realm(realmName);
    const inspectedToken = await KeycloakApi.validate(realm, tokens);

    if (!inspectedToken.active) throw new Error("Access token is invalid.");

    return inspectedToken;
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
