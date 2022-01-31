import KeycloakApi from "@/api/keycloak";
import RealmFactory from "@/models/realms/RealmFactory";
import CookieService from "@/services/Cookie";
import TOTPConfig from "@/types/TOTPConfig";

export default class OneTimePassword {
  public static async getQrCode(sessionCookie: string, patientId: string): Promise<string> {
    await this.validateAuthorization(sessionCookie);
    const realm = RealmFactory.realm(process.env.KEYCLOAK_PATIENT_REALM_NAME);
    const qrCode = await KeycloakApi.setupTOTP(realm, patientId);
    return qrCode;
  }

  public static async registerDevice(totpConfig: TOTPConfig, patientId: string): Promise<void> {
    const realm = RealmFactory.realm(process.env.KEYCLOAK_PATIENT_REALM_NAME);
    await KeycloakApi.registerDevice(totpConfig, realm, patientId);
  }

  private static async validateAuthorization(sessionCookie: string): Promise<void> {
    const realm = await CookieService.validateSessionCookie(sessionCookie);

    const isDotbaseUser = realm.realmName === process.env.KEYCLOAK_DOTBASE_REALM_NAME;
    if (!isDotbaseUser) throw new Error("The user is not authorized to setup OTP.");
  }
}
