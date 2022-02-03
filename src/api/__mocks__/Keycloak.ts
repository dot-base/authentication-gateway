import RealmConfig from "@/types/RealmConfig";
import Tokens from "@/types/Tokens";
import MockTockens from "@tests/__mocks__/Tokens";
import PatientRealm from "@tests/__mocks__/PatientRealm";
import DotbaseRealm from "@tests/__mocks__/DotbaseRealm";
import TokenIntrospection from "@/types/TokenIntrospection";
import MockTokenIntrospection from "@tests/__mocks__/TokenIntrospection";
import qrCodeMock from "@tests/__mocks__/QRCode";
import MockTOTPConfig from "@tests/__mocks__/TOTPConfig";
import TOTPConfig from "@/types/TOTPConfig";

export default class KeycloakApi {
  public static async login(
    realm: RealmConfig,
    username: string,
    password: string
  ): Promise<Tokens> {
    const invalidCredentials = username !== "test" || password !== "test";
    realm.realmName !== PatientRealm.realmName;

    if (invalidCredentials) throw new Error("Unable to login.");

    if (realm.realmName === PatientRealm.realmName) return MockTockens.patientRealm;

    if (realm.realmName === DotbaseRealm.realmName) return MockTockens.dotbaseRealm;

    throw new Error("Unable to login.");
  }


  public static async logout(realm: RealmConfig, refreshToken: string): Promise<void> {
    const invalidToken = refreshToken !== MockTockens.dotbaseRealm.refresh_token && refreshToken !== MockTockens.patientRealm.refresh_token;

    if (invalidToken) throw new Error("Unable to logout.");
  }

  public static async refresh(realm: RealmConfig, refreshToken: string): Promise<Tokens> {
    const invalidRefreshToken =
      refreshToken !== MockTockens.dotbaseRealm.refresh_token &&
      refreshToken !== MockTockens.patientRealm.refresh_token;

    if (invalidRefreshToken) throw new Error("Unable to refresh token.");

    if (realm.realmName === PatientRealm.realmName) return MockTockens.patientRealm;

    if (realm.realmName === DotbaseRealm.realmName) return MockTockens.dotbaseRealm;

    throw new Error("Unable to refresh token.");
  }

  public static async validate(realm: RealmConfig, tokens: Tokens): Promise<TokenIntrospection> {
    const invalidTokens =
      tokens.access_token !== MockTockens.dotbaseRealm.access_token &&
      tokens.access_token !== MockTockens.patientRealm.access_token;

    if (invalidTokens) throw new Error("Unable to validate token.");

    if (realm.realmName === PatientRealm.realmName) return MockTokenIntrospection.patientRealm;

    if (realm.realmName === DotbaseRealm.realmName) return MockTokenIntrospection.dotbaseRealm;

    return {
      active: false,
    };
  }

  public static async setupTOTP(realm: RealmConfig, username: string): Promise<string> {
    const isPatientRealm = realm.realmName === PatientRealm.realmName && username === "testpatient";

    if (!isPatientRealm) throw new Error(`Unable to fetch OTP setup from keycloak server.`);

    return qrCodeMock;
  }

  public static async registerDevice(
    totpConfig: TOTPConfig,
    realm: RealmConfig,
    username: string
  ): Promise<void> {
    const isPatientRealm = realm.realmName === PatientRealm.realmName && username === "testpatient";
    const matchingConfig =
      totpConfig.deviceName === MockTOTPConfig.deviceName &&
      totpConfig.initialCode === MockTOTPConfig.initialCode &&
      totpConfig.secret === MockTOTPConfig.secret;

    if (!matchingConfig || !isPatientRealm)
      throw new Error(`Unable to register device at keycloak server for OTP setup`);
  }
}
