import { Controller, Post, Body, Logger } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  private logger = new Logger('Auth')

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    const account = body.account || body.email
    this.logger.log(`REGISTER username=${body.username} account=${account} keys=${Object.keys(body).join(',')}`)
    return this.authService.register({
      username: body.username,
      account,
      password: body.password,
    })
  }

  @Post('login')
  login(@Body() body: any) {
    const account = body.account || body.email
    this.logger.log(`LOGIN account=${account} password_len=${body.password?.length || 0} keys=${Object.keys(body).join(',')}`)
    return this.authService.login({
      account,
      password: body.password,
    })
  }
}
