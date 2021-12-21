import CryptoJS from "crypto-js";
import Tokens from "@/types/Tokens";

export default class CryptoService {
  private static get aesPassphrases(): string[] {
    if (
      !process.env.DOTBASE_COOKIE_ENCRYPTION_PASSPHRASE_AES ||
      !process.env.PATIENT_COOKIE_ENCRYPTION_PASSPHRASE_AES
    )
      throw new Error("AES passphrase not defined.");
    return [
      process.env.DOTBASE_COOKIE_ENCRYPTION_PASSPHRASE_AES,
      process.env.PATIENT_COOKIE_ENCRYPTION_PASSPHRASE_AES,
    ];
  }

  private static aesPassphrase(realmName: string): string {
    let passPhrase;
    switch (realmName) {
      case process.env.KEYCLOAK_DOTBASE_REALM_NAME:
        passPhrase = process.env.DOTBASE_COOKIE_ENCRYPTION_PASSPHRASE_AES;
      case process.env.KEYCLOAK_PATIENT_REALM_NAME:
        passPhrase = process.env.PATIENT_COOKIE_ENCRYPTION_PASSPHRASE_AES;
    }
    if (!passPhrase) throw new Error("AES passphrase not defined.");
    return passPhrase;
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
