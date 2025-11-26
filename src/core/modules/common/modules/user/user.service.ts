import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';
import { AppErrorNotFound } from 'src/utils/errors/app-errors';
import { FindAllUsersResponse, FindUserByIdResponse } from './doc/user.doc';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<FindUserByIdResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        profile: {
          select: {
            bio: true,
            birthDate: true,
            posts: {
              select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppErrorNotFound('User not found');
    }

    return user;
  }

  async findAll(): Promise<FindAllUsersResponse> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        profile: {
          select: {
            username: true,
            bio: true,
            birthDate: true,
            posts: true,
          },
        },
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.profile?.username ?? 'N/A',
      bio: user.profile?.bio ?? null,
      birthDate: user.profile?.birthDate ?? null,
      numberOfPosts: user.profile?.posts?.length ?? 0,
    }));

    return { users: formattedUsers };
  }
}
