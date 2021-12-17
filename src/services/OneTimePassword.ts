export default class OneTimePassword {
  public static async getQrCode(patientId: string): Promise<string> {
    const qrCode = await KeycloakApi.setupTOTP(patientId);
    return qrCode;
  }
}