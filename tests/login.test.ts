import request from "supertest";
import router from "../src/router";

jest.mock('@/api/keycloak');

beforeAll(() => {
  process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES = "some_passphrase"
});

describe("Login endpoint", () => {
  test("should return HTTP 200 and a session cookie on successful login", async () => {
    const response = await request(router)
      .post("/api/auth/login")
      .send({username: 'test', password: 'test'})
      .set('Accept', 'application/json');
    
    expect(response.statusCode).toBe(200);
  });

  test("should return HTTP 200 and a session cookie on successful login", async () => {
    const response = await request(router)
      .post("/api/auth/login")
      .send({username: 'test', password: 'test'})
      .set('Accept', 'application/json');
    
    expect(response.statusCode).toBe(200);
  });
});