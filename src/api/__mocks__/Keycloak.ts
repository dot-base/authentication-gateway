import RealmConfig from "@/types/RealmConfig";
import Tokens from "@/types/Tokens";
import mockTokens from "@tests/__mocks__/Tokens";
import PatientRealm from "@tests/__mocks__/PatientRealm";
import DotbaseRealm from "@tests/__mocks__/DotbaseRealm";
import TokenIntrospection from "@/types/TokenIntrospection";
import mockIntrospection from "@tests/__mocks__/TokenIntrospection";


export default class KeycloakApi {
  public static async login(
    realm: RealmConfig,
    username: string,
    password: string
  ): Promise<Tokens> {
    const invalidCredentials = username !== "test" || password !== "test";
    const unknownRelamName = realm.realmName !== DotbaseRealm.realmName &&
    realm.realmName !== PatientRealm.realmName;

    if (unknownRelamName)
      throw new Error("Unable to login.");
      
    if (
      realm.realmName === PatientRealm.realmName &&
      invalidCredentials
    )
      throw new Error("Unable to login.");

    if (
      realm.realmName === DotbaseRealm.realmName &&
      invalidCredentials
    )
      throw new Error("Unable to login.");

    return mockTokens;
  }

  public static async refresh(realm: RealmConfig, refreshToken: string): Promise<Tokens> {
    const invalidRefreshToken = refreshToken !== mockTokens.refresh_token;
    const unknownRelamName = realm.realmName !== DotbaseRealm.realmName &&
    realm.realmName !== PatientRealm.realmName;

    if (unknownRelamName)
      throw new Error("Unable to refresh token.");
      
    if (
      realm.realmName === PatientRealm.realmName &&
      invalidRefreshToken
    )
      throw new Error("Unable to refresh token.");

    if (
      realm.realmName === DotbaseRealm.realmName &&
      invalidRefreshToken
    )
      throw new Error("Unable to refresh token.");

    return mockTokens;
  }

  public static async validate(realm: RealmConfig, tokens: Tokens): Promise<TokenIntrospection> {
    const invalidTokens = tokens.expires_in !== mockTokens.expires_in;
    const unknownRelamName = realm.realmName !== DotbaseRealm.realmName &&
    realm.realmName !== PatientRealm.realmName;

    if (unknownRelamName)
      throw new Error("Unable to validate token.");
      
    if (
      realm.realmName === PatientRealm.realmName &&
      invalidTokens
    )
      throw new Error("Unable to validate token.");

    if (
      realm.realmName === DotbaseRealm.realmName &&
      invalidTokens
    )
      throw new Error("Unable to validate token.");
    return mockIntrospection;
  }
}
