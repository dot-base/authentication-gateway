export default interface KeycloakCerts {
  keys: [
    {
      kid: string;
      kty: string;
      alg: string;
      use: string;
      n: string;
      e: string;
      x5c: string[];
      x5t: string;
      "x5t#S256": string;
    }
  ];
}
