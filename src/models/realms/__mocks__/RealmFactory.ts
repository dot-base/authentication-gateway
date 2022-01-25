import RealmConfig from "@/types/RealmConfig";
import MockRealmModel from "@tests/__mocks__/mockRealm";

export default abstract class RealmFactory {
  public static realms = [MockRealmModel.instance];

  public static realm(realmName: string): RealmConfig {
    if (!MockRealmModel.instance.realmName)
      throw new Error(`Keycloak realm with name ${realmName} is not defined.`);
    return MockRealmModel.instance;
  }
}
