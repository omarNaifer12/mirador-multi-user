import { User } from "../../auth/types/types.ts";

export type UserGroup = {
  id:number;
  name:string;
  ownerId:number;
  users:User[];
}

export type CreateGroupDto ={
  name: string;
  ownerId: number;
  users: User[];
}

export type AddProjectToGroupDto ={
  projectId:number;
  groupId:number;
}

export type RemoveProjectToGroupDto ={
  projectId:number;
  groupId:number;
}
