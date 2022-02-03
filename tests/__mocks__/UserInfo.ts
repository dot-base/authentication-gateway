import UserInfo from "@/types/UserInfo";

export default class MockUserInfo {
  public static dotbaseRealm: UserInfo = {
    sub: "af4fa4c7-a077-44be-8077-21eb47a7d8c0",
    name: "Dotbase User",
    given_name: "Dotbase",
    family_name: "User",
    preferred_username: "dotbaseuser",
    email: "dotbaseuser@dotbase.org",
    email_verified: false,
  };

  public static patientRealm: UserInfo = {
    sub: "3cd88173-31da-4fd4-b8dd-2ac9b00f3e7b",
    name: "Patient User",
    given_name: "Patient",
    family_name: "User",
    preferred_username: "patientuser",
    email: "patientuser@dotbase.org",
    email_verified: false,
  };
}
