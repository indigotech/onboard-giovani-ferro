import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../client/client";
import { UserEntity } from "../entities/user-entity.types";
import { ConflictException } from "../exceptions/conflict-exception";
import { UserNotFoundException } from "../exceptions/not-found-exceptions";
import { InternalServerException } from "../exceptions/server-exception";
import { PaginatedRequest, UserRequest } from "../models/user-request.types";
import { PaginatedResponse, UserResponse } from "../models/user-response.types";

export async function getUsers(request: PaginatedRequest): Promise<PaginatedResponse> {
  try {
    const totalUsers = await prisma.user.count()
    const skip = (request.page - 1) * request.pageSize

    const users: UserResponse[] = await prisma.user.findMany({
      take: request.pageSize,
      skip: skip,
      orderBy: {
        name: 'asc'
      },
      select: {
        birthDate: true,
        email: true,
        id: true,
        name: true
      },
    })

    const hasNext = totalUsers > request.pageSize * request.page;
    const hasPrevious = totalUsers > 0 && skip > 0;

    if (!users || users.length === 0) {
      return {
        users: [],
        pagination: {
          total: totalUsers,
          hasNext,
          hasPrevious
        }
      }
    }

    return {
      users,
      pagination: {
        total: totalUsers,
        hasNext,
        hasPrevious
      }
    }
  } catch (error) {
    throw new InternalServerException({ details: "Error when trying to find users from DB" });
  }
}

export async function getUserByEmail(email: string): Promise<UserEntity> {
  const user = await prisma.user.findUnique({ where: { email }, include: { addresses: true } });

  if (!user) {
    throw new UserNotFoundException({});
  }

  return user
}

export async function getUserById(id: number): Promise<UserEntity> {
  const user = await prisma.user.findUnique({ where: { id }, include: { addresses: true } });

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
      }, include: { addresses: true }
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

