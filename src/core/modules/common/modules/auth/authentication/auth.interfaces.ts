import { ENUM_USER_ROLE } from 'src/core/types/enum/user-role.enum';

export interface IRequestUser {
  id: string;
  email: string;
  role?: ENUM_USER_ROLE;
}
