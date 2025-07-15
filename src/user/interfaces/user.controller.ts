import { Controller } from '@nestjs/common';
import { UserService } from '../use-cases/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
