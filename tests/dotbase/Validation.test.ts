import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";
import MockTokenIntrospection from "@tests/__mocks__/TokenIntrospection";

jest.mock("@/api/Keycloak");

@Describe("Validation endpoint for a dotbase user")
export default class ValidationTestGroup {
  @Test("should respond with HTTP status 200 if a valid session cookie is submitted")
  private async testValidSessionCookie() {
    const loginResponse = await request(express)
      .post("/api/auth/login/dotbase")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    await request(express)
      .get("/api/auth/validate")
      .set("Cookie", cookie)
      .expect(200)
      .expect("X-Forwarded-User", MockTokenIntrospection.dotbaseRealm.email ?? "");
  }

  @Test("should respond with HTTP status 401 if an invalid session cookie is submitted")
  private async testInvalidSessionCookie() {
    await request(express)
      .get("/api/auth/validate")
      .set("Cookie", "some-invalid-cookie-value")
      .expect(401);
  }

  @Test("should respond with HTTP status 401 if the session cookie is missing")
  private async testMissingSessionCookie() {
    await request(express).get("/api/auth/validate").expect(401);
  }
}
