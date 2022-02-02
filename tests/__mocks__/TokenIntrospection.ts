import TokenIntrospection from "@/types/TokenIntrospection";

export default class MockTokenIntrospection {
  public static dotbaseRealm: TokenIntrospection = {
    exp: 1643822097,
    iat: 1643821797,
    jti: "b8717893-94dc-429b-b5ca-7bfaeb6e03d5",
    iss: "http://127.0.0.1:8080/auth/realms/dotbase",
    aud: "account",
    sub: "af4fa4c7-a077-44be-8077-21eb47a7d8c0",
    typ: "Bearer",
    azp: "authentication-gateway",
    session_state: "b5b1d97f-1720-4e30-a17f-ddfaa6f9a845",
    name: "Dotbase User",
    given_name: "Dotbase",
    family_name: "User",
    preferred_username: "dotbaseuser",
    email: "dotbaseuser@dotbase.org",
    email_verified: false,
    acr: "1",
    realm_access: {
      roles: ["default-roles-dotbase", "offline_access", "uma_authorization"],
    },
    resource_access: {
      account: {
        roles: ["manage-account", "manage-account-links", "view-profile"],
      },
    },
    scope: "profile email",
    sid: "b5b1d97f-1720-4e30-a17f-ddfaa6f9a845",
    client_id: "authentication-gateway",
    username: "dotbaseuser",
    active: true,
  };

  public static patientRealm: TokenIntrospection = {
    exp: 1643821948,
    iat: 1643821648,
    jti: "d25f067f-7f66-4990-bc1e-632c93d1810d",
    iss: "http://127.0.0.1:8080/auth/realms/patients",
    aud: "account",
    sub: "3cd88173-31da-4fd4-b8dd-2ac9b00f3e7b",
    typ: "Bearer",
    azp: "authentication-gateway",
    session_state: "36989473-34b2-4df2-8672-2d687049c4a0",
    name: "Patient User",
    given_name: "Patient",
    family_name: "User",
    preferred_username: "patientuser",
    email: "patientuser@dotbase.org",
    email_verified: false,
    acr: "1",
    realm_access: {
      roles: ["default-roles-patientapp", "offline_access", "uma_authorization"],
    },
    resource_access: {
      account: {
        roles: ["manage-account", "manage-account-links", "view-profile"],
      },
    },
    scope: "email profile",
    sid: "36989473-34b2-4df2-8672-2d687049c4a0",
    client_id: "authentication-gateway",
    username: "patientuser",
    active: true,
  };
}
