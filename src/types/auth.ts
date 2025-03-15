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
}

export interface Permission extends Role {}

export interface LoginResponse {
  data: User;
  token: {
    access_token: Token;
    refresh_token: Token;
  };
}

export interface BearerTokenPayload {
  access_token: string;
  user_id: string;
  permissions?: string[];
}
export interface BearerTokenResponse {
  access_token: string;
  bearer_token: string;
  validity: string;
}

export interface QueryParams {
  q: string;
  page: number | string;
  per_page: number | string;
  includes: string;
  filters: FilterQueryParams[];
}

export interface FilterQueryParams {
  column: string;
  values: string[];
  operation?: "and" | "or";
}
