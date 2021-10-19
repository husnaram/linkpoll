import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import dayjs from 'dayjs';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ApiOkResponseSchema } from '../common/swagger-api-schemas/api-ok-response.schema';
import { ApiNotFoundResponseSchema } from '../common/swagger-api-schemas/api-not-found-response.schema';
import { ApiUnauthorizedResponseSchema } from '../common/swagger-api-schemas/api-unauthorized-response.schema';
import { ApiBodyLoginResponseSchema } from 'src/common/swagger-api-schemas/api-body-login-response.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBasicAuth()
  @ApiOperation({ summary: 'Login' })
  @ApiBody(ApiBodyLoginResponseSchema('User login with username and password.'))
  @ApiOkResponse(ApiOkResponseSchema('User success login.'))
  @ApiNotFoundResponse(ApiNotFoundResponseSchema('Username'))
  @ApiUnauthorizedResponse(ApiUnauthorizedResponseSchema('Password wrong.'))
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const { user } = req;
    const accessToken = this.authService.generateJwtAccessToken(user);
    const refreshToken = this.authService.generateJwtRefreshToken(user);

    await this.authService.storeRefreshToken(refreshToken, user.id);

    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: dayjs().minute(40).millisecond(),
    });

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: dayjs().hour(2).millisecond(),
    });

    return;
  }

  @ApiBasicAuth()
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse(ApiOkResponseSchema('User success logout.'))
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication');
    res.clearCookie('Refresh');

    return;
  }

  @ApiBasicAuth()
  @ApiOperation({ summary: 'Getting refresh token' })
  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const accessToken = this.authService.generateJwtAccessToken(req.user);

    res.cookie('Authentication', accessToken);

    return;
  }
}
