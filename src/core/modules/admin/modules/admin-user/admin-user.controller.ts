import { Controller } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin/Users')
@Controller('/admin/users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}
}
