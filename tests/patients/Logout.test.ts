import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/keycloak");
jest.mock("@/models/realms/RealmFactory");
jest.mock("@/services/Cookie");

@Describe("Logout endpoint for a patient user")
export default class LogoutTestGroup {
  @Test("should respond with HTTP status 200 and not include a session cookie if loguot succeeds")
  private async testValidLogout() {
    const loginResponse = await request(express)
      .post("/api/auth/login/patients")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    await request(express)
      .post("/api/auth/logout/patients")
      .set("Cookie", cookie)
      .set("Accept", "application/json")
      .expect(200)
      .expect("set-cookie", /.*session=;.*/);
  }

  @Test("should respond with HTTP status 403 if session cookie is missing")
  private async testMissingSessionCookie() {
    await request(express).post("/api/auth/logout/patients").expect(403);
  }
}
