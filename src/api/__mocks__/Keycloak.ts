import RealmConfig from "@/types/RealmConfig";
import Tokens from "@/types/Tokens";
import MockTockens from "@tests/__mocks__/Tokens";
import TokenIntrospection from "@/types/TokenIntrospection";
import MockTokenIntrospection from "@tests/__mocks__/TokenIntrospection";
import qrCodeMock from "@tests/__mocks__/QRCode";
import MockTOTPConfig from "@tests/__mocks__/TOTPConfig";
import TOTPConfig from "@/types/TOTPConfig";
import MockUserInfo from "@tests/__mocks__/UserInfo";
import UserInfo from "@/types/UserInfo";
import PatientRealm from "@/models/realms/PatientRealm";
import DotbaseRealm from "@/models/realms/DotbaseRealm";
import HTTPError from "@/utils/HTTPError";

export default class KeycloakApi {
  public static async login(
    realm: RealmConfig,
    username: string,
    password: string
  ): Promise<Tokens> {
    const invalidCredentials = username !== "test" || password !== "test";
    realm.realmName !== PatientRealm.realmName;

    if (invalidCredentials) throw new HTTPError("Unable to login.", 401);

    if (realm.realmName === PatientRealm.realmName) return MockTockens.patientRealm;

    if (realm.realmName === DotbaseRealm.realmName) return MockTockens.dotbaseRealm;

    throw new HTTPError("Unable to login.", 401);
  }

  public static async logout(realm: RealmConfig, refreshToken: string): Promise<void> {
    const invalidToken =
      refreshToken !== MockTockens.dotbaseRealm.refresh_token &&
      refreshToken !== MockTockens.patientRealm.refresh_token;

    if (invalidToken) throw new HTTPError("Unable to logout.", 500);
  }

  public static async refresh(realm: RealmConfig, refreshToken: string): Promise<Tokens> {
    const invalidRefreshToken =
      refreshToken !== MockTockens.dotbaseRealm.refresh_token &&
      refreshToken !== MockTockens.patientRealm.refresh_token;

    if (invalidRefreshToken) throw new HTTPError("Unable to refresh token.", 401);

    if (realm.realmName === PatientRealm.realmName) return MockTockens.patientRealm;

    if (realm.realmName === DotbaseRealm.realmName) return MockTockens.dotbaseRealm;

    throw new HTTPError("Unable to refresh token.", 401);
  }

  public static async validate(realm: RealmConfig, tokens: Tokens): Promise<TokenIntrospection> {
    const invalidTokens =
      tokens.access_token !== MockTockens.dotbaseRealm.access_token &&
      tokens.access_token !== MockTockens.patientRealm.access_token &&
      tokens.access_token !== MockTockens.dotbaseRealmNotExpired.access_token;

    if (invalidTokens) throw new HTTPError("Unable to validate token.", 401);

    if (realm.realmName === PatientRealm.realmName) return MockTokenIntrospection.patientRealm;

    if (realm.realmName === DotbaseRealm.realmName) return MockTokenIntrospection.dotbaseRealm;

    return {
      active: false,
    };
  }

  public static async userInfo(realm: RealmConfig, tokens: Tokens): Promise<UserInfo> {
    const invalidTokens =
      tokens.access_token !== MockTockens.dotbaseRealm.access_token &&
      tokens.access_token !== MockTockens.patientRealm.access_token;

    if (invalidTokens) throw new HTTPError("Unable to get userinfo.", 500);

    if (realm.realmName === PatientRealm.realmName) return MockUserInfo.patientRealm;

    if (realm.realmName === DotbaseRealm.realmName) return MockUserInfo.dotbaseRealm;

    throw new HTTPError("Unable to get userinfo.", 500);
  }

  public static async setupTOTP(realm: RealmConfig, username: string): Promise<string> {
    const isPatientRealm = realm.realmName === PatientRealm.realmName && username === "testpatient";

    if (!isPatientRealm)
      throw new HTTPError(`Unable to fetch OTP setup from keycloak server.`, 500);

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
      throw new HTTPError(`Unable to register device at keycloak server for OTP setup`, 500);
  }
}
