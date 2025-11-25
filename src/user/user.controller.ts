import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

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

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put(':id')
  //   @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  updatePassword(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    return this.userService.updatePassword(id, dto);
  }
}
