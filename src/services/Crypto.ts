import CryptoJS from "crypto-js";

import Tokens from "@/types/Tokens";

export default class CryptoService {
  private static get aesPassphrase(): string {
    if (!process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES)
      throw new Error("AES passphrase not defined.");
    return process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES;
  }

  public static encrypt(tokens: Tokens): string {
    return CryptoJS.AES.encrypt(JSON.stringify(tokens), this.aesPassphrase).toString();
  }

  public static decrypt(sessionCookie: string): Tokens {
    const bytes = CryptoJS.AES.decrypt(sessionCookie, this.aesPassphrase);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}
