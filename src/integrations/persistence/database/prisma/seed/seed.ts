import * as bcrypt from "bcrypt";
import { Prisma, PrismaClient } from "../../../../../../generated/prisma";

const prisma = new PrismaClient();

function generateBirthDate() {
  const start = new Date(1980, 0, 1);
  const end = new Date(2015, 11, 31);
  const randomTimestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTimestamp);
}

async function main() {
  for (let i = 0; i < 10; i++) {
    let posts: Prisma.PostCreateManyAuthorInput[] = [];

    const numberOfPosts = Math.floor(Math.random() * 10);

    for (let j = 0; j < numberOfPosts; j++) {
      posts.push({
        title: `Post ${j}`,
        content: `Content ${j}`,
      });
    }

    await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: bcrypt.hashSync(`123456-${i}`, 10),
        profile: {
          create: {
            username: `user${i}`,
            bio: `Bio ${i}`,
            birthDate: generateBirthDate(),
            posts: {
              create: posts,
            },
          },
        },
      },
    });
  }

  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
