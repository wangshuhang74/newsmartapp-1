import { http } from "../utils/http_sign";

export const auth = (params) => {
  return http.post("/card/auth", params, { custom: { noAuth: true } });
};

export * from "./account.js";
