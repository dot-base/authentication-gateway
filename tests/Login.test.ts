import { BeforeAll, Describe, Test } from "jest-decorator";
import request from "supertest";

import router from "@/router";

jest.mock('@/api/keycloak');
jest.mock('@/services/Cookie');

@Describe('Login endpoint')
export default class LoginTestGroup {

  public static get validLoginRequest(): request.Test {
    return request(router)
      .post("/api/auth/login")
      .send({username: 'test', password: 'test'})
      .set('Accept', 'application/json')
  }
  
  @BeforeAll
  public beforeAll() {
    process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES = "some_passphrase"
  }

  @Test("should respond with HTTP status 200 and a session cookie if valid login credentials are submitted")
  public async testValidLoginCredentials() {
    await LoginTestGroup.validLoginRequest
      .expect(200)
      .expect('set-cookie', /.*session=.*/)
  }

  @Test("should respond with HTTP status 403 if invalid login credentials are submitted")
  public async testInvalidLoginCredentials() {
    await request(router)
      .post("/api/auth/login")
      .send({username: 'test', password: 'toast'})
      .set('Accept', 'application/json')
      .expect(403)
  }

  @Test("should respond with HTTP status 403 if incomplete login credentials are submitted")
  public async testIncompleteLoginCredentials() {
    await request(router)
      .post("/api/auth/login")
      .send({username: 'test'})
      .set('Accept', 'application/json')
      .expect(403)
    
    await request(router)
      .post("/api/auth/login")
      .send({password: 'toast'})
      .set('Accept', 'application/json')
      .expect(403)
  }

  @Test("should respond with HTTP status 403 if login credentials are missing")
  public async testMissingLoginCredentials() {
    await request(router)
      .post("/api/auth/login")
      .expect(403)
  }

}
