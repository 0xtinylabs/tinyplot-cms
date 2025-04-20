import { PrismaClient } from "@/generated/prisma";

const prismaClient = new PrismaClient();

export const connect = () => {
  try {
    prismaClient.$connect();
  } catch {
    console.log("Error connecting to the database");
    prismaClient.$disconnect();
  }
};

export const isExist = async (filename: string) => {
  const file = await prismaClient.file.findUnique({
    where: { name: filename },
  });

  return file !== null;
};

export const getFile = async (filename: string) => {
  const file = await prismaClient.file.findUnique({
    where: { name: filename },
  });
  if (!file) {
    throw new Error(`File ${filename} not found`);
  }
  return file.content;
};

export const saveFile = async (fileName: string, content: string) => {
  await prismaClient.file.upsert({
    where: { name: fileName },
    update: { content },
    create: { name: fileName, content },
  });
};
