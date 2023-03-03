import { Request } from "express";

export interface UidRequest extends Request {
  uid: string;
}
