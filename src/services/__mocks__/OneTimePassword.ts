import KeycloakApi from "@/api/__mocks__/Keycloak";
import CookieService from "@/services/__mocks__/Cookie";
import RealmFactory from "@/models/realms/__mocks__/RealmFactory";
import TOTPConfig from "@/types/TOTPConfig";
import JwtUtil from "@/utils/Jwt";

export default class OneTimePassword {
  public static async getQrCode(sessionCookie: string, patientId: string): Promise<string> {
    await this.validateAuthorization(sessionCookie);
    const realm = RealmFactory.realm("patients");
    const qrCode = await KeycloakApi.setupTOTP(realm, patientId);
    return qrCode;
  }

  public static async registerDevice(totpConfig: TOTPConfig, patientId: string): Promise<void> {
    const realm = RealmFactory.realm("patients");
    await KeycloakApi.registerDevice(totpConfig, realm, patientId);
  }

  private static async validateAuthorization(sessionCookie: string): Promise<void> {
    const inspectedToken = await CookieService.validateSessionCookie(sessionCookie);
    const tokenIssuer = JwtUtil.getTokenIssuerRealm(inspectedToken);

    const isDotbaseUser = tokenIssuer === "dotbase";
    if (!isDotbaseUser) throw new Error("The user is not authorized to setup OTP.");
  }
}
