import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/keycloak");
jest.mock("@/models/realms/RealmFactory");
jest.mock("@/services/Cookie");

@Describe("Validation endpoint")
export default class ValidationTestGroup {
  @Test("should respond with HTTP status 200 if a valid session cookie is submitted")
  private async testValidSessionCookie() {
    const loginResponse = await request(express)
      .post("/api/auth/login/testrealm")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    await request(express).post("/api/auth/validate").set("Cookie", cookie).expect(200);
  }

  @Test("should respond with HTTP status 403 if an invalid session cookie is submitted")
  private async testInvalidSessionCookie() {
    await request(express)
      .post("/api/auth/validate")
      .set("Cookie", "some-invalid-cookie-value")
      .expect(403);
  }

  @Test("should respond with HTTP status 403 if the session cookie is missing")
  private async testMissingSessionCookie() {
    await request(express).post("/api/auth/validate").expect(403);
  }
}
