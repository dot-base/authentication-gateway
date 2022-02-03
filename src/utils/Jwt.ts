import TokenIntrospection from "@/types/TokenIntrospection";
import Tokens from "@/types/Tokens";
import UserInfo from "@/types/UserInfo";
import jwt, { JwtPayload } from "jsonwebtoken";

export default class JwtUtil {
  public static decode(accessToken: string): JwtPayload {
    const decoded = jwt.decode(accessToken);
    if (!decoded) throw new Error("Access token is invalid.");
    return decoded as JwtPayload;
  }

  public static getTokenIssuerRealm(token: TokenIntrospection): string {
    const realmName = token.iss?.split("/").pop();
    if (!realmName) throw new Error("Access token is invalid.");
    return realmName;
  }

  public static getRealmName(tokens: Tokens): string {
    const jwtPayload = JwtUtil.decode(tokens.access_token);
    const realmName = jwtPayload.iss?.split("/").pop();
    if (!realmName) throw new Error("Access token is invalid.");
    return realmName;
  }

  public static getUserInfo(tokens: Tokens): UserInfo {
    const jwtPayload = JwtUtil.decode(tokens.access_token);
    const userInfo: UserInfo = {
      preferred_username: jwtPayload.preferred_username,
      name: jwtPayload.name,
      given_name: jwtPayload.given_name,
      family_name: jwtPayload.family_name,
      email: jwtPayload.email,
      email_verified: jwtPayload.email_verified,
      realm_access_roles: jwtPayload.realm_access.roles,
    };
    return userInfo;
  }
}
