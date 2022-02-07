import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/Keycloak");

@Describe("Validation endpoint for a patient user")
export default class ValidationTestGroup {
  @Test(
    "should respond with HTTP status 307 if a session cookie with an expired access_token is submitted"
  )
  private async testExpiredSession() {
    const loginResponse = await request(express)
      .post("/api/auth/login/patients")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];
    const redirectUri = "http://movebase.charite.de/anywhere";

    await request(express)
      .get("/api/auth/validate")
      .set("Cookie", cookie)
      .set("Location", redirectUri)
      .expect(307)
      .expect("set-cookie", /.*session=.*/)
      .expect("X-Forwarded-Uri", redirectUri);
  }
}
