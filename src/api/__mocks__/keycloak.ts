import RealmConfig from "@/types/RealmConfig";
import Tokens from "@/types/Tokens";
import mockTokens from "@tests/__mocks__/tokens";
import mockRealm from "@tests/__mocks__/mockRealm";

export default class KeycloakApi {
  public static async login(
    realm: RealmConfig,
    username: string,
    password: string
  ): Promise<Tokens> {
    if (
      realm.realmName !== mockRealm.instance.realmName ||
      username !== "test" ||
      password !== "test"
    )
      throw new Error("Unable to login.");
    return mockTokens;
  }

  public static async refresh(realm: RealmConfig, refreshToken: string): Promise<Tokens> {
    if (
      realm.realmName !== mockRealm.instance.realmName ||
      refreshToken !== mockTokens.refresh_token
    )
      throw new Error("Unable to login.");
    return mockTokens;
  }
}
