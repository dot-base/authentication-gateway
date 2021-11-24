import KeycloakApi from "@/api/__mocks__/keycloak";
import mockTokens from "@tests/__mocks__/tokens";
import CryptoService from "@/services/Crypto";

export default class CookieService {
  public static async createSessionCookie(username: string, password: string): Promise<string> {
    const tokens = await KeycloakApi.login(username, password);
    return CryptoService.encrypt(tokens);
  }

  public static async renewSessionCookie(sessionCookie: string): Promise<string> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const newTokens = await KeycloakApi.refresh(tokens.refresh_token);
    return CryptoService.encrypt(newTokens);
  }

  public static async validateSessionCookie(sessionCookie: string): Promise<void> {
    const tokens = CryptoService.decrypt(sessionCookie);
    if (tokens.access_token !== mockTokens.access_token)
      throw new Error("Access token is invalid.");
  }
}
