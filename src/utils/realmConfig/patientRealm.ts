import RealmConfig from "@/types/RealmConfig";

export default class PatientRealmConfig implements RealmConfig {
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
}
