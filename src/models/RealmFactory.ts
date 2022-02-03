import RealmConfig from "@/types/RealmConfig";
import PatientRealmModel from "@/models/realms/PatientRealm";
import DotbaseRealmModel from "@/models/realms/DotbaseRealm";

export default abstract class RealmFactory {
  public static realms = [PatientRealmModel, DotbaseRealmModel];

  public static realm(realmName: string | undefined): RealmConfig {
    switch (realmName) {
      case process.env.KEYCLOAK_DOTBASE_REALM_NAME:
        return DotbaseRealmModel;
      case process.env.KEYCLOAK_PATIENT_REALM_NAME:
        return PatientRealmModel;
      default:
        throw new Error(`Keycloak realm with name ${realmName} is not defined.`);
    }
  }
}
