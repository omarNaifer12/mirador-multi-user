import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";


@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login with your credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: loginDto) {
    return this.authService.signIn(signInDto.mail, signInDto.password);
  }

  @ApiOperation({ summary: 'get your profile' })
  @UseGuards(AuthGuard)
  @Get('profile')
  getprofile(@Request() req) {
    return this.authService.findProfile(req.user.sub);
  }
}
