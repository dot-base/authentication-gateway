import KeycloakApi from "@/api/keycloak";
import CookieService from "./Cookie";

export default class OneTimePassword {
  public static async getQrCode(patientId: string, sessionCookie: string): Promise<string> {
    const realmName = await CookieService.validateSessionCookie(sessionCookie);

    const isAllowed = realmName === process.env.KEYCLOAK_DOTBASE_REALM_NAME;
    if (!isAllowed) throw new Error("User not authorized to setup OTP.");

    const qrCode = await KeycloakApi.setupTOTP(patientId);
    return qrCode;
  }
}
