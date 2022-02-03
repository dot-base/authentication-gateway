import CryptoJS from "crypto-js";
import Tokens from "@/types/Tokens";
import RealmFactory from "@/models/RealmFactory";
import RealmConfig from "@/types/RealmConfig";

export default class CryptoService {
  private static get aesPassphrases(): string[] {
    return RealmFactory.realms.map((realm) => realm.passPhrase);
  }

  public static encrypt(realm: RealmConfig, tokens: Tokens): string {
    return CryptoJS.AES.encrypt(JSON.stringify(tokens), realm.passPhrase).toString();
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
