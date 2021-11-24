import Tokens from "@/types/Tokens";
import mockTokens from "@tests/__mocks__/tokens";

export default class KeycloakApi {
  public static async login(username: string, password: string): Promise<Tokens> {
    if (username !== "test" || password !== "test") throw new Error("Unable to login.");
    return mockTokens;
  }

  public static async refresh(refreshToken: string): Promise<Tokens> {
    if (refreshToken !== mockTokens.refresh_token) throw new Error("Unable to login.");
    return mockTokens;
  }
}
