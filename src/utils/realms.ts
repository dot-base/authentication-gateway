import realmConfig from "@/types/RealmConfig";
import PatientRealmModel from "@/models/realms/PatientRealm";
import DotbaseRealmModel from "@/models/realms/DotbaseRealm";

import Tokens from "@/types/Tokens";
import JwtUtil from "./Jwt";

export default class RealmsUtil {
  public static realmConfig(realmName: string): realmConfig {
    switch (realmName) {
      case process.env.KEYCLOAK_DOTBASE_REALM_NAME:
        return DotbaseRealmModel.getInstance();
      case process.env.KEYCLOAK_PATIENT_REALM_NAME:
        return PatientRealmModel.getInstance();
      default:
        throw new Error("Keycloak realm name is not defined.");
    }
  }

  public static async realmName(tokens: Tokens): Promise<string> {
    const jwtPayload = await JwtUtil.decode(tokens.access_token);
    const realmName = jwtPayload.iss?.split("/").pop();
    if (!realmName) throw new Error("Access token is invalid.");
    return realmName;
  }
}
