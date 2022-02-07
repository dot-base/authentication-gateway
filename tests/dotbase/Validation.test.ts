import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";
import MockTokenIntrospection from "@tests/__mocks__/TokenIntrospection";
import MockCookie from "@tests/__mocks__/Cookie";

jest.mock("@/api/Keycloak");
jest.mock("@tests/__mocks__/Cookie");

@Describe("Validation endpoint for a dotbase user")
export default class ValidationTestGroup {
  @Test("should respond with HTTP status 200 if a valid session cookie is submitted")
  private async testValidSessionCookie() {
    await request(express)
      .get("/api/auth/validate")
      .set("Cookie", MockCookie.notExpiredDotbaseRealm)
      .expect(200)
      .expect("X-Forwarded-User", MockTokenIntrospection.dotbaseRealm.email ?? "")
      .expect("X-Auth-Realm", process.env.KEYCLOAK_DOTBASE_REALM_NAME ?? "dotbase");
  }

  @Test(
    "should respond with HTTP status 307 if a session cookie with an expired access_token is submitted"
  )
  private async testExpiredSession() {
    const loginResponse = await request(express)
      .post("/api/auth/login/dotbase")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];
    const redirectUri = "http://movebase.charite.de/anywhere";

    await request(express)
      .get("/api/auth/validate")
      .set("Cookie", cookie)
      .set("x-forwarded-uri", redirectUri)
      .expect(307)
      .expect("set-cookie", /.*session=.*/)
      .expect("location", redirectUri);
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
