import RealmConfig from "@/types/RealmConfig";

export default class MockRealmModel implements RealmConfig {
  private static _instance: MockRealmModel;

  public static get instance(): MockRealmModel {
    if (!this._instance) this._instance = new MockRealmModel();
    return this._instance;
  }

  public get realmName(): string {
    return "testrealm";
  }

  public get clientId(): string {
    return "test_realm_authentication_gateway_client_id";
  }

  public get clientSecret(): string {
    return "test_realm_authentication_gateway_client_secret";
  }

  public get passPhrase(): string {
    return "some_passphrase";
  }
}
