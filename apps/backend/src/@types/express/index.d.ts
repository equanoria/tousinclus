import { UserDto } from 'src/users/dto/user.dto';

declare module 'express' {
  export interface Request {
    user?: UserDto;
  }
}
