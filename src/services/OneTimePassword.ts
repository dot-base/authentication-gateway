import KeycloakApi from "@/api/keycloak";
import CookieService from "@/services/Cookie";

export default class OneTimePassword {
  public static async getQrCode(patientId: string): Promise<string> {
    const qrCode = await KeycloakApi.setupTOTP(patientId);
    return qrCode;
  }

  public static async getAuthorizedRealmName(sessionCookie: string): Promise<string> {
    const realmName = await CookieService.validateSessionCookie(sessionCookie);

    const isAllowed = realmName === process.env.KEYCLOAK_DOTBASE_REALM_NAME;
    if (!isAllowed) throw new Error("User not authorized to setup OTP.");

    return realmName;
  }
}
