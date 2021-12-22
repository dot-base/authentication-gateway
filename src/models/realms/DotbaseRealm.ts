import RealmConfig from "@/types/RealmConfig";
import CertificateModel from "@/models/Certificate";

export default class DotbaseRealmModel implements RealmConfig {
  constructor() {
    this._certificateModel = new CertificateModel();
    this._certificateModel.fetchCertificates(this);
  }

  private static _instance: DotbaseRealmModel;

  public static get instance(): DotbaseRealmModel {
    if (!this._instance) this._instance = new DotbaseRealmModel();
    return this._instance;
  }

  private _certificateModel;

  public get realmName(): string {
    if (!process.env.KEYCLOAK_DOTBASE_REALM_NAME)
      throw new Error("Keycloak realm name is not defined.");
    return process.env.KEYCLOAK_DOTBASE_REALM_NAME;
  }

  public get clientId(): string {
    if (!process.env.KEYCLOAK_DOTBASE_REALM_CLIENT_ID)
      throw new Error("Keycloak client ID is not defined.");
    return process.env.KEYCLOAK_DOTBASE_REALM_CLIENT_ID;
  }

  public get clientSecret(): string {
    if (!process.env.KEYCLOAK_DOTBASE_REALM_CLIENT_SECRET)
      throw new Error("Keycloak client secret is not defined.");
    return process.env.KEYCLOAK_DOTBASE_REALM_CLIENT_SECRET;
  }

  public get passPhrase(): string {
    if (!process.env.DOTBASE_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES)
      throw new Error("Keycloak cookie encryption passphrase is not defined.");
    return process.env.DOTBASE_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES;
  }

  public get certs(): string[] {
    return this._certificateModel.certificates(this.realmName);
  }
}
