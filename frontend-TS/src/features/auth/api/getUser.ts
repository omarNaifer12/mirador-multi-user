import storage from "../../../utils/storage.ts";
import { User } from "../types/types.ts";

export const getUser = async (): Promise<User> => {
  const BACKEND_URL = import.meta.env.BACKEND_URL;
  const token = storage.getToken();
  try {
    const response = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
  }
};
