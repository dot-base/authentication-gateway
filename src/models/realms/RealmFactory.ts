import realmConfig from "@/types/RealmConfig";
import PatientRealmModel from "@/models/realms/PatientRealm";
import DotbaseRealmModel from "@/models/realms/DotbaseRealm";

export default abstract class RealmFactory {
  public static realms = [PatientRealmModel.instance, DotbaseRealmModel.instance];

  public static realm(realmName: string | undefined): realmConfig {
    switch (realmName) {
      case process.env.KEYCLOAK_DOTBASE_REALM_NAME:
        return DotbaseRealmModel.instance;
      case process.env.KEYCLOAK_PATIENT_REALM_NAME:
        return PatientRealmModel.instance;
      default:
        throw new Error(`Keycloak realm with name ${realmName} is not defined.`);
    }
  }
}
