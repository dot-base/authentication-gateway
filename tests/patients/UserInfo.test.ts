import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/Keycloak");

@Describe("UserInfo endpoint for a patient user")
export default class UserInfoTestGroup {
  @Test("should respond with HTTP status 403")
  private async testUserInfoForbidden() {
    const loginResponse = await request(express)
      .post("/api/auth/login/patients")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    await request(express)
      .get("/api/auth/userinfo")
      .set("x-auth-realm", process.env.KEYCLOAK_PATIENT_REALM_NAME ?? "patients")
      .set("Cookie", cookie)
      .expect(403);
  }
}
