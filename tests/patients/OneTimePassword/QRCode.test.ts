import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/Keycloak");

@Describe("OneTimePassword /qrcode/:patientId endpoint")
export default class OneTimePasswordTestGroup {
  @Test("should respond with HTTP status 200 and a qrCode if a valid session cookie is submitted")
  private async testQRCodeValidSessionCookie() {
    const loginResponse = await request(express)
      .post("/api/auth/login/dotbase")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    const res = await request(express)
      .get("/api/auth/totp/qrcode/testpatient")
      .set("Cookie", cookie)
      .set("x-auth-realm", process.env.KEYCLOAK_DOTBASE_REALM_NAME ?? "dotbase")
      .expect(200);
    expect(res.body).toHaveProperty("qrCode");
  }

  @Test("should respond with HTTP status 403 if a not authorized user (e.g. patient) requests a qrCode")
  private async testQRCodeUnauthorizedSessionCookie() {
    const loginResponse = await request(express)
      .post("/api/auth/login/patients")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");
  
    const cookie = loginResponse.headers["set-cookie"][0];

    await request(express)
      .get("/api/auth/totp/qrcode/testpatient")
      .set("Cookie", cookie)
      .set("x-auth-realm", process.env.KEYCLOAK_PATIENT_REALM_NAME ?? "patients")
      .expect(403);
  }

  @Test("should respond with HTTP status 401 if the session cookie is missing")
  private async testQRCodeMissingSessionCookie() {
    await request(express).get("/api/auth/totp/qrcode/test").set("x-auth-realm", process.env.KEYCLOAK_DOTBASE_REALM_NAME ?? "dotbase").expect(401);
  }
}
