import CryptoJS from "crypto-js";
import Tokens from "@/types/Tokens";

export default class CryptoService {
  private static get aesPassphrases(): string[] {
    if (!process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES)
      throw new Error("AES passphrase not defined.");
    return [process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES];
  }

  private static aesPassphrase(realmName: string): string {
    if (!realmName || !process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES)
      throw new Error("AES passphrase not defined.");
    return process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES;
  }

  public static encrypt(realmName: string, tokens: Tokens): string {
    return CryptoJS.AES.encrypt(JSON.stringify(tokens), this.aesPassphrase(realmName)).toString();
  }

  public static decrypt(sessionCookie: string): Tokens {
    for (const aesPassphrase of this.aesPassphrases) {
      const token = this.decryptToken(sessionCookie, aesPassphrase);
      if (token) return token;
    }
    throw new Error("Access token is invalid.");
  }

  private static decryptToken(sessionCookie: string, aesPassphrase: string): Tokens | undefined {
    try {
      const bytes = CryptoJS.AES.decrypt(sessionCookie, aesPassphrase);
      const token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return token;
    } catch (error) {
      return undefined;
    }
  }
}
