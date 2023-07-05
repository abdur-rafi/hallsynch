import { PrismaClient } from "@prisma/client";

export interface Context{
    prisma : PrismaClient
    identity : Identity
}

export interface Identity{
    studentId : number,
    authorityId : number
}