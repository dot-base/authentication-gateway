import KeycloakApi from "@/api/__mocks__/Keycloak";
import CryptoService from "@/services/__mocks__/Crypto";
import JwtUtil from "@/utils/Jwt";
import RealmConfig from "@/types/RealmConfig";
import RealmFactory from "@/models/realms/__mocks__/RealmFactory";
import UserInfo from "@/types/UserInfo";

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

  public static async validateSessionCookie(sessionCookie: string): Promise<RealmConfig> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const realmName = JwtUtil.getRealmName(tokens);
    const realm = RealmFactory.realm(realmName);
    const inspectedToken = await KeycloakApi.validate(realm, tokens);

    if (!inspectedToken.active) throw new Error("Access token is invalid.");

    return realm;
  }


  public static async invalidateSessionCookie(sessionCookie: string): Promise<void> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const realmName = JwtUtil.getRealmName(tokens);
    const realm = RealmFactory.realm(realmName);
    await KeycloakApi.logout(realm, tokens.refresh_token);
  }

  public static async getUserInfo(sessionCookie: string): Promise<UserInfo> {
    const tokens = CryptoService.decrypt(sessionCookie);
    return JwtUtil.getUserInfo(tokens);
  }
}
