import KeycloakApi from "@/api/keycloak";
import RealmConfig from "@/types/RealmConfig";

export default class CertificateModel {
  private static _certificates: Map<string, string[]> = new Map();

  private static wrapCertificateInformation(certificate: string): string {
    return `-----BEGIN CERTIFICATE-----\n${certificate}\n-----END CERTIFICATE-----`;
  }

  public certificates(realmName: string): string[] {
    const certs = CertificateModel._certificates.get(realmName);
    if (!certs) throw new Error("Keycloak realm name is not defined.");
    return certs;
  }

  private addCertificates(realmName: string, certificates: string[]) {
    const certs = certificates.map((certificate) =>
      CertificateModel.wrapCertificateInformation(certificate)
    );
    CertificateModel._certificates.set(realmName, certs);
  }

  public async fetchCertificates(realm: RealmConfig): Promise<void> {
    const certificates = await KeycloakApi.certificates(realm);
    this.addCertificates(realm.realmName, certificates);
  }
}
