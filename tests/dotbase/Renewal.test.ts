import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/keycloak");
jest.mock("@/models/realms/RealmFactory");
jest.mock("@/services/Cookie");

@Describe("Renewal endpoint for a dotbase user")
export default class RenewalTestGroup {
  @Test(
    "should respond with HTTP status 200 and a session cookie if a valid session cookie is submitted"
  )
  private async testRenewValidSessionCookie() {
    const loginResponse = await request(express)
      .post("/api/auth/login/dotbase")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    await request(express)
      .get("/api/auth/renew/dotbase")
      .set("Cookie", cookie)
      .expect(200)
      .expect("set-cookie", /.*session=.*/);
  }

  @Test("should respond with HTTP status 403 if an invalid session cookie is submitted")
  private async testInvalidSessionCookie() {
    await request(express)
      .get("/api/auth/renew/dotbase")
      .set("Cookie", "some-invalid-cookie-value")
      .expect(403);
  }

  @Test("should respond with HTTP status 403 if the session cookie is missing")
  private async testMissingSessionCookie() {
    await request(express).get("/api/auth/renew/dotbase").expect(403);
  }
}
