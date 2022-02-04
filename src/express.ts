import express from "express";
import cookieParser from "cookie-parser";

import LoginRouter from "@/routers/Login";
import LogoutRouter from "@/routers/Logout";
import ValidationRouter from "@/routers/Validation";
import OTPRouter from "@/routers/OneTimePassword";
import UserInfoRouter from "@/routers/UserInfo";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/login", LoginRouter);
app.use("/api/auth/logout", LogoutRouter);
app.use("/api/auth/validate", ValidationRouter);
app.use("/api/auth/userinfo", UserInfoRouter);
app.use("/api/auth/totp", OTPRouter);

export default app;
