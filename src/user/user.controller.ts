import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  //   @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  getUserById(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
