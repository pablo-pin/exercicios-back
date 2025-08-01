import { Prisma, PrismaClient } from '../../../../../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 10; i++) {
    let posts: Prisma.PostCreateManyAuthorInput[] = [];

    const numberOfPosts = Math.floor(Math.random() * 101);

    const birthDate = faker.date.birthdate({
      min: 10,
      max: 40,
      mode: 'age',
    });

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = faker.internet.password();

    for (let j = 0; j < numberOfPosts; j++) {
      posts.push({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        deleted: faker.datatype.boolean({ probability: 0.9 }),
      });
    }

    await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }),
        password: bcrypt.hashSync(password, 10),
        profile: {
          create: {
            username: faker.internet.username({ firstName, lastName }),
            bio: faker.lorem.paragraph(),
            birthDate,
            posts: {
              create: posts,
            },
          },
        },
      },
    });
  }

  await prisma.user.create({
    data: {
      email: 'daltineo@email.com',
      password: bcrypt.hashSync('123456', 10),
      profile: {
        create: {
          username: 'daltineo',
          bio: 'I am a software engineer',
          birthDate: new Date('2002-01-01'),
          posts: {
            create: [
              {
                title: 'Milkshake de banana',
                content:
                  'A receita de milkshake de banana é muito simples e fácil de fazer. Basta misturar o leite, o suco de banana e o açúcar no liquidificador e pronto!',
              },
              {
                title: 'Pão de queijo',
                content: 'Pão de queijo é bão demais, sô!',
              },
            ],
          },
        },
      },
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
