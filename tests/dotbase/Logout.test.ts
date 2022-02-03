import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/Keycloak");

@Describe("Logout endpoint for a dotbase user")
export default class LogoutTestGroup {
  @Test("should respond with HTTP status 200 and not include a session cookie if loguot succeeds")
  private async testValidLogout() {
    const loginResponse = await request(express)
      .post("/api/auth/login/dotbase")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    await request(express)
      .post("/api/auth/logout/dotbase")
      .set("Cookie", cookie)
      .set("Accept", "application/json")
      .expect(200)
      .expect("set-cookie", /.*session=;.*/);
  }

  @Test("should respond with HTTP status 401 if session cookie is missing")
  private async testMissingSessionCookie() {
    await request(express).post("/api/auth/logout/dotbase").expect(401);
  }
}
