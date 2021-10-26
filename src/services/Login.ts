import CryptoJS from "crypto-js";

import KeycloakApi from "@/api/keycloak";

export default class LoginService {
  private static get aesPassphrase(): string {
    if (!process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES)
      throw new Error("AES passphrase not defined.");
    return process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES;
  }

  public static async createSessionCookie(username: string, password: string): Promise<string> {
    const tokens = await KeycloakApi.login(username, password);
    return CryptoJS.AES.encrypt(JSON.stringify(tokens), this.aesPassphrase).toString();
  }
}
