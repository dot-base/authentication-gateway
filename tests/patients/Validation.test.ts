import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";
import MockTokenIntrospection from "@tests/__mocks__/TokenIntrospection";
import MockCookie from "@tests/__mocks__/Cookie";

jest.mock("@/api/Keycloak");

@Describe("Validation endpoint for a patient user")
export default class ValidationTestGroup {
  @Test("should respond with HTTP status 200 if a valid session cookie is submitted")
  private async testValidSessionCookie() {
    await request(express)
      .get("/api/auth/validate")
      .set("Cookie", MockCookie.notExpiredPatientRealm)
      .expect(200)
      .expect("X-Forwarded-User", MockTokenIntrospection.patientRealm.email ?? "")
      .expect("X-Auth-Realm", process.env.KEYCLOAK_PATIENT_REALM_NAME ?? "patients");
  }

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
