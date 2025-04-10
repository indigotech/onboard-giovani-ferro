import prisma from "../client/client";
import { UserEntity } from "../entities/user-entity.types";

export async function getUsers(): Promise<UserEntity[]> {
  try {
    const users: UserEntity[] = await prisma.user.findMany()

    if (!users || users.length === 0) {
      return [];
    }

    return users;
  } catch (error) {

    console.error("Error getting user:", error);
    throw error;
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
  }
}
