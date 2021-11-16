import Tokens from "@/types/Tokens";

export default class KeycloakApi {
  public static get tokens(): Tokens {
    return {
      access_token:
        "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJSWDY2d2E5V1NTdld6SVcyWXVsZmdUTXlpaV9LZlhndU5uYzVmbWFna29JIn0.eyJleHAiOjE2MzMzNTI1MzIsImlhdCI6MTYzMzM1MjIzMiwianRpIjoiNGRlOTZhYTUtOGJiYi00YjZmLTgwMDAtNWFkMzMwMjZhN2ZmIiwiaXNzIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvcmVhbG1zL2RvdGJhc2UiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiN2VhYzI2OGMtNGJhMC00NjJhLThlMDQtYTY5NWE2ZTAzN2E3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWVkaWNhbC1kYXNoYm9hcmQiLCJzZXNzaW9uX3N0YXRlIjoiNTJkZGQxZGYtOWUzMy00NWQ0LWJjYzAtNmQ0ZmE1NDIwOTc2IiwiYWNyIjoiMSIsInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6InRlc3QifQ.G7O8WV4tU_UD1bFS3-sQE40pmgEZlHWYUASGfkJYUBB_E0CN7kzMTDAwfjJaQfWkydtdTb2LAc4N-u9UHBk2WlUdft9GdYsSvFSIIrf5xcH6yjXdMc8usVLUMvBH6SIwLsZ5gNULT7yrqOk3GLXu3k1k6vyBJfKp4QL8XCb0BajGwRmlWGhfQO8ryA7qyPeUskdSlPGa83gt-pgMsiqZUrRa1NVUWIoVEuazW9rLDa744wOXY6s_i-7hqsqRhmKVGdALGzx8-XSIvrobdnK9sLNfNYrIoW9Xr4euTIUZzLZQYj401yL-AgNy9hjtu9Cw_aN-B-FU74voSon07v9scA",
      expires_in: 300,
      refresh_expires_in: 1800,
      refresh_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyZTIzYmQ1ZS05ZDE4LTRkMTctODNmMC03YTcxOTcyZTYyMzMifQ.eyJleHAiOjE2MzMzNTQwMzIsImlhdCI6MTYzMzM1MjIzMiwianRpIjoiZDgwYmNlZDItMzBjYS00YzJlLTk3OWUtMDc0OTNiZDVjODcyIiwiaXNzIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvcmVhbG1zL2RvdGJhc2UiLCJhdWQiOiJodHRwOi8vMTI3LjAuMC4xOjgwODAvYXV0aC9yZWFsbXMvZG90YmFzZSIsInN1YiI6IjdlYWMyNjhjLTRiYTAtNDYyYS04ZTA0LWE2OTVhNmUwMzdhNyIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJtZWRpY2FsLWRhc2hib2FyZCIsInNlc3Npb25fc3RhdGUiOiI1MmRkZDFkZi05ZTMzLTQ1ZDQtYmNjMC02ZDRmYTU0MjA5NzYiLCJzY29wZSI6ImVtYWlsIHByb2ZpbGUifQ.ZETFv13vr9_zXWUDo7F79Fkqd1G8yvfbpVQdMEW6fGI",
      token_type: "Bearer",
      "not-before-policy": 0,
      session_state: "52ddd1df-9e33-45d4-bcc0-6d4fa5420976",
      scope: "email profile",
    };
  }

  public static async login(username: string, password: string): Promise<Tokens> {
    if (username !== "test" || password !== "test") throw new Error("Unable to login.");
    return this.tokens;
  }

  public static async refresh(refreshToken: string): Promise<Tokens> {
    if (refreshToken !== KeycloakApi.tokens.refresh_token) throw new Error("Unable to login.");
    return this.tokens;
  }
}
