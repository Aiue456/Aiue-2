import { IsString, MinLength, MaxLength } from 'class-validator'

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  account: string

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string
}

export class LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  account: string

  @IsString()
  password: string
}
