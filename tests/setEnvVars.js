function setEnvVars() {
  process.env.KEYCLOAK_DOTBASE_REALM_NAME = "dotbase";
  process.env.KEYCLOAK_DOTBASE_REALM_CLIENT_ID = "authentication-gateway";
  process.env.KEYCLOAK_DOTBASE_REALM_CLIENT_SECRET = "dotbase-realm-secret";
  process.env.DOTBASE_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES = "dotbase-realm-passphrase";

  process.env.KEYCLOAK_PATIENT_REALM_NAME = "patients";
  process.env.KEYCLOAK_PATIENT_REALM_CLIENT_ID = "authentication-gateway";
  process.env.KEYCLOAK_PATIENT_REALM_CLIENT_SECRET = "patient-realm-secret";
  process.env.PATIENT_REALM_COOKIE_ENCRYPTION_PASSPHRASE_AES = "patient-realm-passphrase";
}

setEnvVars();
