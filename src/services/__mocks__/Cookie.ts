import KeycloakApi from "@/api/__mocks__/keycloak";
import mockTokens from "@tests/__mocks__/tokens";
import CryptoService from "@/services/__mocks__/Crypto";
import JwtUtil from "@/utils/Jwt";

export default class CookieService {
  public static async createSessionCookie(
    realmName: string,
    username: string,
    password: string
  ): Promise<string> {
    const tokens = await KeycloakApi.login(realmName, username, password);
    return CryptoService.encrypt(realmName, tokens);
  }

  public static async renewSessionCookie(
    realmName: string,
    sessionCookie: string
  ): Promise<string> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const newTokens = await KeycloakApi.refresh(realmName, tokens.refresh_token);
    return CryptoService.encrypt(realmName, newTokens);
  }

  public static async validateSessionCookie(sessionCookie: string): Promise<string> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const realmName = await JwtUtil.getRealmName(tokens);

    if (tokens.access_token !== mockTokens.access_token)
      throw new Error("Access token is invalid.");
    return realmName;
  }
}
