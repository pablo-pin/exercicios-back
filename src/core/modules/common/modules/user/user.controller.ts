import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { Doc } from 'src/utils/documentation/doc';
import { FindAllUsersResponse, FindUserByIdResponse } from './doc/user.doc';

@ApiTags('Public/User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Doc({
    name: 'Find all users',
    response: FindAllUsersResponse,
    hasAuth: false,
  })
  @Get('/')
  async findAll() {
    return await this.userService.findAll();
  }

  @Doc({
    name: 'Find user by id',
    response: FindUserByIdResponse,
    hasAuth: false,
  })
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }
}
