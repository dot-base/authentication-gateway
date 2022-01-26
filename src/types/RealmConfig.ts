export default abstract class RealmConfig {
  public abstract get realmName(): string;
  public abstract get clientId(): string;
  public abstract get clientSecret(): string;
  public abstract get passPhrase(): string;
}
