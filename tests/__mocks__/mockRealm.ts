import CertificateModel from "@/models/Certificate";
import RealmConfig from "@/types/RealmConfig";

export default class MockRealmModel implements RealmConfig {
  constructor() {
    this._certificateModel = new CertificateModel();
  }
  private static _instance: MockRealmModel;

  public static get instance(): MockRealmModel {
    if (!this._instance) this._instance = new MockRealmModel();
    return this._instance;
  }

  private _certificateModel;

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

  public get certs(): string[] {
    return ["certificate_no_1", "certificate_no_2"];
  }
}
