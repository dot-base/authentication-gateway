import KeycloakApi from "@/api/keycloak";
import CryptoService from "@/services/Crypto";

export default class LoginService {
  public static async createSessionCookie(username: string, password: string): Promise<string> {
    const tokens = await KeycloakApi.login(username, password);
    return CryptoService.encrypt(tokens);
  }
}
