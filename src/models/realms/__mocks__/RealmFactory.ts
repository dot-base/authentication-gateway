import RealmConfig from "@/types/RealmConfig";
import PatientRealmModel from "@tests/__mocks__/PatientRealm";
import DotbaseRealmModel from "@tests/__mocks__/DotbaseRealm";

export default abstract class RealmFactory {
  public static realms = [PatientRealmModel, DotbaseRealmModel];

  public static realm(realmName: string): RealmConfig {
    switch (realmName) {
      case "dotbase":
        return DotbaseRealmModel;
      case "patients":
        return PatientRealmModel;
      default:
        throw new Error(`Keycloak realm with name ${realmName} is not defined.`);
    }
  }
}
