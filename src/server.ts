import { Express } from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import router from "@/express";

export default class Server {
  private static get port(): string {
    return process.env.PORT || "3000";
  }

  private static get sentryIsEnabled(): boolean {
    return !!process.env.SENTRY_DSN && !!process.env.SENTRY_ENVIRONMENT;
  }

  private static enableSentry(app: Express) {
    if (!Server.sentryIsEnabled) return;
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
      ],
      tracesSampleRate: 1.0,
      environment: process.env.SENTRY_ENVIRONMENT,
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
    app.use(Sentry.Handlers.errorHandler());
  }

  private static validateEnvironmentVariables() {
    const requiredEnvVariables = [
      "COOKIE_ENCRYPTION_PASSPHRASE_AES",
      "KEYCLOAK_REALM_NAME",
      "KEYCLOAK_CLIENT_ID",
      "KEYCLOAK_CLIENT_SECRET",
    ];
    for (const envVariable of requiredEnvVariables) {
      if (!process.env[envVariable])
        throw new Error(
          `Environment variable ${envVariable} is unset, but required for the service to work.`
        );
    }
  }

  constructor() {
    this.startApiServer();
  }

  private async startApiServer() {
    Server.validateEnvironmentVariables();

    Server.enableSentry(router);

    router.listen(Server.port, () => {
      console.log(`Server listening on ${Server.port}`);
    });
  }
}

new Server();
