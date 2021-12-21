import RealmConfig from "@/types/RealmConfig";
import CertificateModel from "@/models/Certificate";

export default class DotbaseRealmModel implements RealmConfig {
  constructor() {
    this._certificateModel = new CertificateModel();
    this._certificateModel.fetchCertificates(this.realmName);
  }

  private static instance: DotbaseRealmModel;

  public static getInstance(): DotbaseRealmModel {
    if (!this.instance) this.instance = new DotbaseRealmModel();
    return this.instance;
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

  public certs(): string[] {
    return this._certificateModel.certificates(this.realmName);
  }
}
