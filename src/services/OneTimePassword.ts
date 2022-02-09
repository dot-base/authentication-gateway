import KeycloakApi from "@/api/Keycloak";
import RealmFactory from "@/models/RealmFactory";
import TOTPConfig from "@/types/TOTPConfig";

export default class OneTimePassword {
  public static async getQrCode(sessionCookie: string, patientId: string): Promise<string> {
    const realm = RealmFactory.realm(process.env.KEYCLOAK_PATIENT_REALM_NAME);
    const qrCode = await KeycloakApi.setupTOTP(realm, patientId);
    return qrCode;
  }

  public static async registerDevice(totpConfig: TOTPConfig, patientId: string): Promise<void> {
    const realm = RealmFactory.realm(process.env.KEYCLOAK_PATIENT_REALM_NAME);
    await KeycloakApi.registerDevice(totpConfig, realm, patientId);
  }
}
