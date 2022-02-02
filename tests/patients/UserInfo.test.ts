import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/keycloak");
jest.mock("@/models/realms/RealmFactory");
jest.mock("@/services/Cookie");

@Describe("UserInfo endpoint for a patient user")
export default class UserInfoTestGroup {
  @Test(
    "should respond with HTTP status 200 and a userinfo json if a valid session cookie is submitted"
  )
  private async testUserInfoValidSessionCookie() {
    const loginResponse = await request(express)
      .post("/api/auth/login/patients")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    const res = await request(express)
      .get("/api/auth/userinfo")
      .set("Cookie", cookie)
      .expect(200);
    expect(res.body).toHaveProperty("preferred_username")
  }
}
