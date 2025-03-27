import type { RoutingMicroserviceType } from "@/microservice";
import type { QueryParams } from "./general";

export interface LoginCredential {
  email: string;
  password: string;
}

export interface User {
  email: string;
  given_name: string;
  last_name: string;
  updated_at: string;
  created_at: string;
  id: string;
  user_role_ids?: string[];
  user_permissions?: RolePermission[];
}

export interface Token {
  id?: string;
  token: string;
  validity: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  role_permissions?: RolePermission[];
}

export interface UserRole {
  user_id: string;
  id: string;
  user: User;
  roles: Role[];
}

export interface Permission extends Omit<Role, "role_permissions"> {}

export interface RolePermission {
  microservice: RoutingMicroserviceType;
  updated_at: string;
  created_at: string;
  id: string;
  permissions: Permission[];
}

export interface LoginResponse {
  data: User;
  token: {
    access_token: Token;
    refresh_token: Token;
  };
}

export interface UserChangePassPayload {
  current_password: string;
  new_password: string;
}
export interface UserPayload {
  mail: string;
  password?: string;
  given_name: string;
  last_name: string;
}

export interface UserRoleAttachPayload {
  roles?: string[];
}
export interface UserPermissionAttachPayload {
  microservices: PermissionAttachMicroservicePayload[];
}
export interface BearerTokenPayload {
  access_token: string;
  user_id: string;
  permissions?: string[];
}

export interface PermissionPayload {
  name: string;
  description: string;
}

export interface RolePayload extends PermissionPayload {}

export interface PermissionAttachPayload {
  role_id: string;
  microservices: PermissionAttachMicroservicePayload[];
}
export interface PermissionAttachMicroservicePayload {
  name: RoutingMicroserviceType;
  permissions: string[];
}

export interface BearerTokenResponse {
  access_token: string;
  bearer_token: string;
  validity: string;
}

/* QUERY PARAMS */
export type PermissionQueryParams = Omit<QueryParams, "per_page"> & {
  pages: string;
};

export type RoleQueryParams = PermissionQueryParams;
