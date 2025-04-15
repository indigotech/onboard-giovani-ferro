import { prisma } from "../client/client";
import { UserEntity } from "../entities/user-entity.types";
import { UserRequest } from "../models/user-request.types";

export async function getUsers(): Promise<UserEntity[]> {
  try {
    const users: UserEntity[] = await prisma.user.findMany()

    if (!users || users.length === 0) {
      return [];
    }

    return users
  } catch (error) {

    console.error("Error getting user:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<UserEntity> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user
  } catch (error) {

    console.error("Error getting user:", error);
    throw error;
  }
}

export async function createUser(userRequest: UserRequest): Promise<UserEntity> {
  try {
    const user: UserEntity = await prisma.user.create({
      data: {
        name: userRequest.name,
        email: userRequest.email,
        password: userRequest.password,
        birthDate: new Date(userRequest.birthDate),
      }
    })

    if (!user) {
      throw new Error("Não foi possível criar o usuário");
    }

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
