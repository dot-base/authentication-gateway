import express from "express";
import AuthenticationError from "../utils/AuthenticationError";

import jwt from "jsonwebtoken";
import CertficateModel from "@/models/Certificate";

export default class AuthenticationService {
  public static async verify(req: express.Request): Promise<void> {
    if (!req.headers.authorization)
      throw new AuthenticationError("Authorization header is missing.");

    if (!req.headers.authorization.startsWith("Bearer "))
      throw new AuthenticationError("Authorization header is required to have bearer format.");

    const accessToken = req.headers.authorization.replace("Bearer ", "");

    if (!accessToken) throw new AuthenticationError("Access token is missing.");

    for (const certificate of CertficateModel.certificates) {
      const tokenIsValid = await this.isValid(accessToken, certificate);
      if (tokenIsValid) return;
    }

    throw new AuthenticationError("Access token is invalid.");
  }

  private static async isValid(accessToken: string, certificate: string): Promise<boolean> {
    try {
      await this.verifyJwt(accessToken, certificate);
      return true;
    } catch (e) {
      return false;
    }
  }

  private static verifyJwt(accessToken: string, cert: string): Promise<void> {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, cert, {}, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}
