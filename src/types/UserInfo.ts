export default interface UserInfo {
  sub?: string;
  preferred_username: string;
  name?: string;
  family_name?: string;
  given_name?: string;
  email?: string;
  email_verified?: boolean;
  realm_access_roles?: string[];
}
