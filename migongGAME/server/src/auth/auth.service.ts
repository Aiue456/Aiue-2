import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User } from '../schemas'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(dto: { username: string; account: string; password: string }) {
    if (!dto.account) throw new ConflictException('账号不能为空')
    const exists = await this.userModel.findOne({ account: dto.account }).exec()
    if (exists) throw new ConflictException('账号已被注册')

    const hash = await bcrypt.hash(dto.password, 10)
    const user = await this.userModel.create({
      username: dto.username,
      account: dto.account,
      password: hash,
      avatar: '',
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      isGuest: false,
    })

    const token = this.jwtService.sign({ sub: user._id, account: user.account })
    return {
      success: true,
      data: {
        user: { id: user._id, username: user.username, account: user.account, avatar: user.avatar, createdAt: user.createdAt },
        token,
      },
    }
  }

  async login(dto: { account: string; password: string }) {
    if (!dto.account || !dto.password) {
      throw new UnauthorizedException('请输入账号和密码')
    }

    const user = await this.userModel.findOne({ account: dto.account }).exec()
    if (!user) {
      throw new UnauthorizedException(`账号 "${dto.account}" 不存在，请先注册`)
    }

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) {
      throw new UnauthorizedException('密码错误，请重试')
    }

    await this.userModel.findByIdAndUpdate(user._id, { lastLoginAt: Date.now() }).exec()

    const token = this.jwtService.sign({ sub: user._id, account: user.account })
    return {
      success: true,
      data: {
        user: { id: user._id, username: user.username, account: user.account, avatar: user.avatar },
        token,
      },
    }
  }
}
