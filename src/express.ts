import express from "express";
import cookieParser from "cookie-parser";

import LoginRouter from "@/routers/Login";
import ValidationRouter from "@/routers/Validation";
import RenewalRouter from "@/routers/Renewal";
import OTPRouter from "@/routers/OneTimePassword";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/login", LoginRouter);
app.use("/api/auth/validate", ValidationRouter);
app.use("/api/auth/renew", RenewalRouter);
app.use("/api/auth/totp/setup", OTPRouter);

export default app;
