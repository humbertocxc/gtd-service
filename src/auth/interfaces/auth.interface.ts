export interface ValidatedTokenPayload {
  userId: string;
  roles: string[];
}

export interface RequestUser {
  userId: string;
  roles: string[];
}

export interface AuthenticatedRequest {
  user: RequestUser;
  headers: {
    authorization?: string;
    [key: string]: string | string[] | undefined;
  };
}
