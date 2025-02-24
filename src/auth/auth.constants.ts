// tables
export const USER_TABLE = 'users';

// regex
export const PASSWORD_PATTERN =
  /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export enum PermissionNames {
  EXAMPLE = 'example',
  USER = 'user',
}

// default in db
export enum RoleNames {
  SUPER_USER = 'superuser',
  ADMIN = 'admin',
  USER = 'user',
}

// default in db
export enum DefaultEmails {
  SUPER_USER = 'superuser@yopmail.com',
  ADMIN = 'admin@yopmail.com',
  USER = 'user@yopmail.com',
}

export interface JwtPayload {
  id: number;
  // ...others
}
