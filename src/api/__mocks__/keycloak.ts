import Tokens from "@/types/Tokens";
import mockTokens from "@tests/__mocks__/tokens";

export default class KeycloakApi {
  public static async login(
    realmName: string,
    username: string,
    password: string
  ): Promise<Tokens> {
    if (realmName !== "testrealm" || username !== "test" || password !== "test")
      throw new Error("Unable to login.");
    return mockTokens;
  }

  public static async refresh(realmName: string, refreshToken: string): Promise<Tokens> {
    if (realmName !== "testrealm" || refreshToken !== mockTokens.refresh_token)
      throw new Error("Unable to login.");
    return mockTokens;
  }
}
