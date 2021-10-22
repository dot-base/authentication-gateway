import express, { Express } from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import AuthenticationRouter from "@/routers/Authentication";

class Server {
  private static get port(): string {
    return process.env.PORT || "3000";
  }

  private static get sentryIsEnabled(): boolean {
    return !!process.env.SENTRY_DSN && !!process.env.SENTRY_ENVIRONMENT;
  }

  constructor() {
    this.startApiServer();
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

  private async startApiServer() {
    const app = express();

    Server.enableSentry(app);

    app.use("/", AuthenticationRouter);

    app.listen(Server.port, () => {
      console.log(`Server listening on ${Server.port}`);
    });
  }
}

new Server();
