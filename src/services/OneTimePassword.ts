import KeycloakApi from "@/api/Keycloak";
import RealmFactory from "@/models/RealmFactory";
import CookieService from "@/services/Cookie";
import TOTPConfig from "@/types/TOTPConfig";
import HTTPError from "@/utils/HTTPError";
import JwtUtil from "@/utils/Jwt";

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
    const inspectedToken = await CookieService.validateSessionCookie(sessionCookie);
    const tokenIssuer = JwtUtil.getTokenIssuerRealm(inspectedToken);

    const isDotbaseUser = tokenIssuer === process.env.KEYCLOAK_DOTBASE_REALM_NAME;
    if (!isDotbaseUser) throw new HTTPError("The user is not authorized to setup OTP.", 403);
  }
}
