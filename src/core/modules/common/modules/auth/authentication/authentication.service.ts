import { Injectable } from '@nestjs/common';
import {
  AppErrorConflict,
  AppErrorInternal,
  AppErrorUnauthorized,
} from 'src/utils/errors/app-errors';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';
import { User } from 'generated/prisma';
import { AuthPayload } from 'src/core/types/interfaces/auth-payload.inteface';
import { IRequestUser } from './auth.interfaces';
import { ConfigService } from '@nestjs/config';
import { SignInDto, SignUpDto } from 'src/core/modules/public/auth/dto/auth.dto';
import { SignInResponseDto, SignUpResponseDto } from 'src/core/modules/public/auth/doc/auth.doc';

@Injectable()
export class AuthenticationService {
  private readonly JWT_SECRET: string;
  private readonly EXP_TOKEN_ACCESS = '365d';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET');

    if (!this.JWT_SECRET) {
      throw new AppErrorInternal('JWT_SECRET is not defined in environment variables');
    }
  }

  private async validateAndGenerateToken(
    user: User,
    informedPassword: string,
  ): Promise<string | null> {
    const { password } = user;

    const validPassword = await bcrypt.compare(informedPassword, password);

    if (!validPassword) {
      return null;
    }

    const payload: AuthPayload = {
      sub: user.id,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: this.EXP_TOKEN_ACCESS,
      secret: this.JWT_SECRET,
    });

    return token;
  }

  // metodo utilizado pela strategy jwt, inclui os dados do usuario no contexto da requisição
  async validateAuthentication(payload: AuthPayload): Promise<IRequestUser> {
    const { sub } = payload;
    const userId = sub;

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const { email, password, name } = signUpDto;

    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new AppErrorConflict('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = await this.validateAndGenerateToken(user, password);

    return {
      token,
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  async signIn(signAuthDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = signAuthDto;

    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppErrorUnauthorized('Credenciais inválidas');
    }

    const token = await this.validateAndGenerateToken(user, password);

    if (!token) {
      throw new AppErrorUnauthorized('Credenciais inválidas');
    }

    return {
      id: user.id,
      role: user.role,
      token,
    };
  }
}
