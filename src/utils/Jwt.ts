import Tokens from "@/types/Tokens";
import jwt, { JwtPayload } from "jsonwebtoken";

export default class JwtUtil {
  public static verify(accessToken: string, cert: string): Promise<void> {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, cert, {}, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public static async isValid(accessToken: string, certificate: string): Promise<boolean> {
    try {
      await this.verify(accessToken, certificate);
      return true;
    } catch (e) {
      return false;
    }
  }

  public static decode(accessToken: string): JwtPayload {
    const decoded = jwt.decode(accessToken);
    if (!decoded) throw new Error("Access token is invalid.");
    return decoded as JwtPayload;
  }

  public static getRealmName(tokens: Tokens): string {
    const jwtPayload = JwtUtil.decode(tokens.access_token);
    const realmName = jwtPayload.iss?.split("/").pop();
    if (!realmName) throw new Error("Access token is invalid.");
    return realmName;
  }
}
