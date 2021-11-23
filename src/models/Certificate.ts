import fetch from "node-fetch";

import KeycloakCerts from "@/types/KeycloakCerts";
import KeycloakApi from "@/api/keycloak";

class CertificateModel {
  private static get certsUrl(): string {
    return new URL(`${KeycloakApi.baseUrl}/protocol/openid-connect/certs`).toString();
  }

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
    const certsResponse = await fetch(CertificateModel.certsUrl);
    const certsJson = (await certsResponse.json()) as KeycloakCerts;
    this.certificates = certsJson.keys.flatMap((key) => key.x5c);
  }
}

export default new CertificateModel();
