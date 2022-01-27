import RealmConfig from "@/types/RealmConfig";

class PatientRealmModel implements RealmConfig {
  public get realmName(): string {
    if (!process.env.KEYCLOAK_PATIENT_REALM_NAME)
      throw new Error("Keycloak realm name is not defined.");
    return process.env.KEYCLOAK_PATIENT_REALM_NAME;
  }

  public get clientId(): string {
    if (!process.env.KEYCLOAK_PATIENT_REALM_CLIENT_ID)
      throw new Error("Keycloak client ID is not defined.");
    return process.env.KEYCLOAK_PATIENT_REALM_CLIENT_ID;
  }

  public get clientSecret(): string {
    if (!process.env.KEYCLOAK_PATIENT_REALM_CLIENT_SECRET)
      throw new Error("Keycloak client secret is not defined.");
    return process.env.KEYCLOAK_PATIENT_REALM_CLIENT_SECRET;
  }

  public get passPhrase(): string {
    if (!process.env.PATIENT_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES)
      throw new Error("Keycloak cookie encryption passphrase is not defined.");
    return process.env.PATIENT_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES;
  }
}

export default new PatientRealmModel();
