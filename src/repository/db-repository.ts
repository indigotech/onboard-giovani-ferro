import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../client/client";
import { UserEntity } from "../entities/user-entity.types";
import { ConflictException } from "../exceptions/conflict-exception";
import { UserNotFoundException } from "../exceptions/not-found-exceptions";
import { InternalServerException } from "../exceptions/server-exception";
import { UserRequest } from "../models/user-request.types";

export async function getUsers(): Promise<UserEntity[]> {
  try {
    const users: UserEntity[] = await prisma.user.findMany()

    if (!users || users.length === 0) {
      return [];
    }

    return users
  } catch (error) {
    throw new InternalServerException({ details: "Error when trying to find users from DB" });
  }
}

export async function getUserByEmail(email: string): Promise<UserEntity> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new UserNotFoundException({});
  }

  return user
}

export async function getUserById(id: number): Promise<UserEntity> {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new UserNotFoundException({});
  }

  return user
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

    return user;
  } catch (error) {
    const { code } = error as PrismaClientKnownRequestError

    if (code === 'P2002') {
      const message = "Falha ao criar o usuário: email já existe";
      const details = "Email already exists in the database and must be unique";
      throw new ConflictException({ message, details });
    }

    throw new InternalServerException({ details: "Error when trying to create user into DB" });
  }
}

