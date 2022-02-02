import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/keycloak");
jest.mock("@/models/realms/RealmFactory");
jest.mock("@/services/Cookie");
jest.mock("@/services/OneTimePassword");

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
      .expect(200);
    expect(res.body).toHaveProperty("qrCode");
  }

  @Test("should respond with HTTP status 403 if an invalid session cookie is submitted")
  private async testQRCodeInvalidSessionCookie() {
    await request(express)
      .get("/api/auth/totp/qrcode/testpatient")
      .set("Cookie", "some-invalid-cookie-value")
      .expect(403);
  }

  @Test("should respond with HTTP status 403 if the session cookie is missing")
  private async testQRCodeMissingSessionCookie() {
    await request(express).get("/api/auth/totp/qrcode/test").expect(403);
  }
}
