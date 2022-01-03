import KeycloakApi from "@/api/__mocks__/keycloak";
import mockTokens from "@tests/__mocks__/tokens";
import CryptoService from "@/services/__mocks__/Crypto";
import JwtUtil from "@/utils/Jwt";
import RealmConfig from "@/types/RealmConfig";
import RealmFactory from "@/models/realms/__mocks__/RealmFactory";

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

    if (mockTokens.access_token !== tokens.access_token)
      throw new Error("Access token is invalid.");

    return realm;
  }
}
