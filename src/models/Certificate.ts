import KeycloakApi from "@/api/keycloak";

class CertificateModel {
  private static wrapCertificateInformation(certificate: string): string {
    return `-----BEGIN CERTIFICATE-----\n${certificate}\n-----END CERTIFICATE-----`;
  }

  public get certificates(): string[] {
    return this._certificates;
  }

  private set certificates(certificates: string[]) {
    this._certificates = certificates.map((certificate) =>
      CertificateModel.wrapCertificateInformation(certificate)
    );
  }

  private _certificates: string[] = [];

  constructor() {
    this.fetchCertificates();
  }

  private async fetchCertificates() {
    this.certificates = await KeycloakApi.certificates();
  }
}

export default new CertificateModel();
