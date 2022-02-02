import RealmConfig from "@/types/RealmConfig";

class PatientRealmModel implements RealmConfig {
  public get realmName(): string {
    return "patients";
  }

  public get clientId(): string {
    return "patient_realm_authentication_gateway_client_id";
  }

  public get clientSecret(): string {
    return "patient_realm_authentication_gateway_client_secret";
  }

  public get passPhrase(): string {
    return "patient_realm_passphrase";
  }
}
export default new PatientRealmModel();
