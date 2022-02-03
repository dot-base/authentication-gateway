import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/Keycloak");

@Describe("Renewal endpoint for a patient user")
export default class RenewalTestGroup {
  @Test(
    "should respond with HTTP status 200 and a session cookie if a valid session cookie is submitted"
  )
  private async testRenewValidSessionCookie() {
    const loginResponse = await request(express)
      .post("/api/auth/login/patients")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    await request(express)
      .post("/api/auth/renew/patients")
      .set("Cookie", cookie)
      .expect(200)
      .expect("set-cookie", /.*session=.*/);
  }

  @Test("should respond with HTTP status 401 if an invalid session cookie is submitted")
  private async testInvalidSessionCookie() {
    await request(express)
      .post("/api/auth/renew/patients")
      .set("Cookie", "some-invalid-cookie-value")
      .expect(401);
  }

  @Test("should respond with HTTP status 401 if the session cookie is missing")
  private async testMissingSessionCookie() {
    await request(express).post("/api/auth/renew/patients").expect(401);
  }
}
