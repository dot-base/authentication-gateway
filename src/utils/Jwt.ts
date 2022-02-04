import TokenIntrospection from "@/types/TokenIntrospection";
import Tokens from "@/types/Tokens";
import jwt, { JwtPayload } from "jsonwebtoken";

export default class JwtUtil {
  public static decode(token: string): JwtPayload {
    const decoded = jwt.decode(token);
    if (!decoded) throw new Error("Token is invalid.");
    return decoded as JwtPayload;
  }

  public static getTokenIssuerRealm(token: TokenIntrospection): string {
    const realmName = token.iss?.split("/").pop();
    if (!realmName) throw new Error("Token is invalid.");
    return realmName;
  }

  public static getRealmName(tokens: Tokens): string {
    const jwtPayload = JwtUtil.decode(tokens.access_token);
    const realmName = jwtPayload.iss?.split("/").pop();
    if (!realmName) throw new Error("Token is invalid.");
    return realmName;
  }

  public static isExpired(token: string): boolean {
    const expireTime = JwtUtil.decode(token).exp;

    if (!expireTime) return true;

    return new Date(expireTime).toISOString() < new Date().toISOString();
  }
}
