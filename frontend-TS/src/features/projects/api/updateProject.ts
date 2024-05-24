import storage from "../../../utils/storage.ts";
import { Project } from "../types/types";

export const updateProject = async (project: Project) => {
  const BACKEND_URL = import.meta.env.BACKEND_URL;
  const token = storage.getToken();
  try {
    const response = await fetch(`${BACKEND_URL}/project/${project.id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};
