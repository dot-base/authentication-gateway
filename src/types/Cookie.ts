import { CookieOptions } from "express";

export default interface Cookie {
  value: string;
  options: CookieOptions;
}
