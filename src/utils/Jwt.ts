import jwt from "jsonwebtoken";

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
}
