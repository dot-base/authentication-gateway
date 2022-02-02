import RealmConfig from "@/types/RealmConfig";

class DotbaseRealmModel implements RealmConfig {
  private static _instance: DotbaseRealmModel;

  public static get instance(): DotbaseRealmModel {
    if (!this._instance) this._instance = new DotbaseRealmModel();
    return this._instance;
  }

  public get realmName(): string {
    return "dotbase";
  }

  public get clientId(): string {
    return "dotbase_realm_authentication_gateway_client_id";
  }

  public get clientSecret(): string {
    return "dotbase_realm_authentication_gateway_client_secret";
  }

  public get passPhrase(): string {
    return "dotbase_realm_passphrase";
  }
}

export default new DotbaseRealmModel();
