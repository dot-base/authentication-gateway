import TokenIntrospection from "@/types/TokenIntrospection";

export default class MockTokenIntrospection {
  public static dotbaseRealm: TokenIntrospection = {
    exp: 1643802378,
    iat: 1643802078,
    jti: "44bfdb2b-56fd-4416-86ac-9bf63b5371ef",
    iss: "http://127.0.0.1:8080/auth/realms/dotbase",
    aud: "account",
    sub: "eb5f4777-fc26-4762-a43f-812ae3e1944b",
    typ: "Bearer",
    azp: "authentication-gateway",
    session_state: "f390ce63-7a60-4953-8b6b-d3429a9805d6",
    name: "Max Mustermann",
    given_name: "Max",
    family_name: "Mustermann",
    preferred_username: "dotbase",
    email: "dotbase-realm-tester@dotbase.org",
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
    sid: "f390ce63-7a60-4953-8b6b-d3429a9805d6",
    client_id: "authentication-gateway",
    username: "dotbase",
    active: true,
  };

  public static patientRealm: TokenIntrospection = {
    exp: 1643802378,
    iat: 1643802078,
    jti: "44bfdb2b-56fd-4416-86ac-9bf63b5371ef",
    iss: "http://127.0.0.1:8080/auth/realms/dotbase",
    aud: "account",
    sub: "eb5f4777-fc26-4762-a43f-812ae3e1944b",
    typ: "Bearer",
    azp: "authentication-gateway",
    session_state: "f390ce63-7a60-4953-8b6b-d3429a9805d6",
    name: "Max Mustermann",
    given_name: "Max",
    family_name: "Mustermann",
    preferred_username: "dotbase",
    email: "dotbase-realm-tester@dotbase.org",
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
    sid: "f390ce63-7a60-4953-8b6b-d3429a9805d6",
    client_id: "authentication-gateway",
    username: "dotbase",
    active: true,
  };
}
