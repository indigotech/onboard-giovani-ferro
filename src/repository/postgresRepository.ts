
import { PrismaClient } from "@prisma/client";
import { User } from "./user.types";

const prisma = new PrismaClient()

export async function getUsers(): Promise<User[]> {
  try {
    const users: User[] = await prisma.user.findMany()

    if (!users || users.length === 0) {
      return [];
    }


    return users;
  } catch (error) {

    console.error("Error getting user:", error);
    throw error;
  } finally {
    await prisma.$disconnect()
  }
}

export async function createUser(): Promise<void> {
  try {
    await prisma.user.create({
      data: {
        name: "New User",
        email: "newuser@example.com",
        password: "securepassword",
        birthDate: new Date("2000-01-01"),
      }
    })
  } catch (error) {

    console.error("Error creating user:", error);
    throw error;
  } finally {
    await prisma.$disconnect()
  }
}
