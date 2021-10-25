import CertificateModel from "@/models/Certificate";
import CryptoService from "@/services/Crypto";
import JwtUtil from "@/utils/Jwt";

export default class ValidationService {
  public static async validate(sessionCookie: string): Promise<void> {
    const tokens = CryptoService.decrypt(sessionCookie);

    for (const certificate of CertificateModel.certificates) {
      const tokenIsValid = await JwtUtil.isValid(tokens.access_token, certificate);
      if (!tokenIsValid) throw new Error("Access token is invalid.");
    }
  }
}
