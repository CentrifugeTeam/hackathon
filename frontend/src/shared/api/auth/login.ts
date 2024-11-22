import qs from "qs";
import api from "../base";
import { LoginData } from "./types";

export const login = async (data: LoginData): Promise<void> => {
  const formattedData = qs.stringify(data);
  await api.post("/auth/jwt/login", formattedData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};
