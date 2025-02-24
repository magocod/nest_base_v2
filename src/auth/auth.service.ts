import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './users/entities';
import { LoginUserDto, RegisterUserDto, RecoveryPasswordDto } from './dto';
import { JwtPayload } from './auth.constants';
import {
  CREDENTIALS_INVALID_EMAIL,
  CREDENTIALS_INVALID_PASSWORD,
} from './auth.messages';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: RegisterUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        // password: bcrypt.hashSync(password, 10),
        password
      });

      await this.userRepository.save(user);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }, //! OJO!
    });

    if (!user) throw new UnauthorizedException(CREDENTIALS_INVALID_EMAIL);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(CREDENTIALS_INVALID_PASSWORD);

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  private handleDBErrors(error: any): never {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check server logs');
  }

  sendEmailRecoverPassword(data: RecoveryPasswordDto) {
    const url = `http://example.com/auth/confirm?token=abc`;
    return {
      data,
      url
    }
    // return this.emailQueue.add(EmailJobNames.basic, {
    //   log: true,
    //   options: {
    //     to: [data.email],
    //     subject: 'Recovery password',
    //     html: `<b>Recovery password</b> <br> <b>url: ${url}</b>`,
    //   },
    // });
  }
}
