export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface PublicUser {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
