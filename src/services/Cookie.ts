import KeycloakApi from "@/api/keycloak";
import RealmFactory from "@/models/realms/RealmFactory";
import CryptoService from "@/services/Crypto";
import RealmConfig from "@/types/RealmConfig";
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

  public static async validateSessionCookie(sessionCookie: string): Promise<RealmConfig> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const realmName = JwtUtil.getRealmName(tokens);
    const realm = RealmFactory.realm(realmName);
    const tokenIsValid = await KeycloakApi.validate(realm, tokens);

    if (tokenIsValid) throw new Error("Access token is invalid.");

    return realm;
  }

  public static async getUserInfo(sessionCookie: string): Promise<UserInfo> {
    const tokens = CryptoService.decrypt(sessionCookie);
    return JwtUtil.getUserInfo(tokens);
  }
}
