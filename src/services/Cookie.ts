import KeycloakApi from "@/api/keycloak";
import CryptoService from "@/services/Crypto";
import JwtUtil from "@/utils/Jwt";
import RealmsUtil from "@/utils/realms";

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
    const realmName = await RealmsUtil.realmName(tokens);
    const certificates = RealmsUtil.realmConfig(realmName).certs();

    for (const certificate of certificates) {
      const tokenIsValid = await JwtUtil.isValid(tokens.access_token, certificate);
      if (tokenIsValid) return realmName;
    }
    throw new Error("Access token is invalid.");
  }
}
