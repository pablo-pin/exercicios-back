import { PrismaClient, UserRole } from '../../../../../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = faker.internet.password();
    const email = faker.internet.email({ firstName, lastName }).toLocaleLowerCase();

    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: bcrypt.hashSync(password, 10),
      },
    });
  }

  await prisma.user.create({
    data: {
      email: 'admin@email.com',
      password: bcrypt.hashSync('123456', 10),
      name: 'Admin',
      role: UserRole.ADMIN,
    },
  });

  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
