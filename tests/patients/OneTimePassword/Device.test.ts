import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/Keycloak");

@Describe("OneTimePassword /device/:patientId endpoint")
export default class DeviceTestGroup {
  @Test(
    "should respond with HTTP status 200 if a valid request with totp config parameters is submitted"
  )
  private async testDeviceValidRequest() {
    const res = await request(express)
      .post("/api/auth/totp/device/testpatient")
      .send({ deviceName: "test-device", initialCode: "123456", secret: "123-456-789" })
      .expect(204);
    expect(res.body).toBeNull;
  }

  @Test("should respond with HTTP status 401 if an invalid initialCode is submitted")
  private async testInvalidInitialCode() {
    await request(express)
      .post("/api/auth/totp/device/testpatient")
      .send({ deviceName: "test-device", initialCode: "654321", secret: "123-456-789" })
      .expect(401);
  }

  @Test("should respond with HTTP status 401 if an invalid secret is submitted")
  private async testInvalidSecret() {
    await request(express)
      .post("/api/auth/totp/device/testpatient")
      .send({ deviceName: "test-device", initialCode: "123456", secret: "987-654-321" })
      .expect(401);
  }

  @Test("should respond with HTTP status 401 if no deviceName is submitted")
  private async testNoDeviceName() {
    await request(express)
      .post("/api/auth/totp/device/testpatient")
      .send({ initialCode: "123456", secret: "123-456-789" })
      .expect(401);
  }

  @Test("should respond with HTTP status 401 if no initialCode is submitted.")
  private async testNoInitialCode() {
    await request(express)
      .post("/api/auth/totp/device/testpatient")
      .send({ deviceName: "test-device", secret: "123-456-789" })
      .expect(401);
  }

  @Test("should respond with HTTP status 401 if no secret is submitted.")
  private async testNoSecret() {
    await request(express)
      .post("/api/auth/totp/device/testpatient")
      .send({ deviceName: "test-device", initialCode: "123456" })
      .expect(401);
  }
}
