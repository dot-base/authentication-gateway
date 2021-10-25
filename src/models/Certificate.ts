import fetch from "node-fetch";

import KeycloakCerts from "@/types/KeycloakCerts";

class CertificateModel {
  private static get realmUrl(): string {
    const urlString = process.env.KEYCLOAK_REALM_URL ?? "http://keycloak:8080/auth/realms/dotbase";
    return new URL(urlString).toString();
  }

  private static get certsUrl(): string {
    return new URL(`${this.realmUrl}/protocol/openid-connect/certs`).toString();
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
