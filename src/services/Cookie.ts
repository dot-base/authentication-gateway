import KeycloakApi from "@/api/keycloak";
import CryptoService from "@/services/Crypto";
import CertificateModel from "@/models/Certificate";
import JwtUtil from "@/utils/Jwt";

export default class CookieService {
  public static async createSessionCookie(
    realmName: string,
    username: string,
    password: string
  ): Promise<string> {
    const tokens = await KeycloakApi.login(realmName, username, password);
    return CryptoService.encrypt(tokens);
  }

  public static async renewSessionCookie(
    realmName: string,
    sessionCookie: string
  ): Promise<string> {
    const tokens = CryptoService.decrypt(sessionCookie);
    const newTokens = await KeycloakApi.refresh(realmName, tokens.refresh_token);
    return CryptoService.encrypt(newTokens);
  }

  public static async validateSessionCookie(sessionCookie: string): Promise<void> {
    const tokens = CryptoService.decrypt(sessionCookie);

    for (const certificate of CertificateModel.certificates) {
      const tokenIsValid = await JwtUtil.isValid(tokens.access_token, certificate);
      if (tokenIsValid) return;
    }
    throw new Error("Access token is invalid.");
  }
}
