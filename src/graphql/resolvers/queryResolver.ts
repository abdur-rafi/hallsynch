import {Authorized, Ctx, Query, Resolver} from 'type-graphql'
import { Department, SeatApplication, Student, Vote } from '../graphql-schema'
import { Context } from '../interface'
import { params, roles } from '../utility';
@Resolver()
export class queryResolver{
    @Query(returns => String)
    test(){
        return 'Hello world'
    }

    @Query(returns => [Department])
    async departments(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.department.findMany();
    }

    @Authorized(roles.PROVOST)
    @Query(returns =>[SeatApplication])
    async applications(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.seatApplication.findMany({
            take : params.provostApplicationCount,
            orderBy : {
                createdAt : 'desc'
            }
        })
    }

    @Authorized(roles.STUDENT)
    @Query(returns =>[SeatApplication])
    async myapplications(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.seatApplication.findMany({
            orderBy : {
                createdAt : 'desc'
            },
            where : {
                studentId : ctx.identity.studentId
            }
        })
    }

    @Authorized(roles.STUDENT_RESIDENT)
    @Query(returns => [Vote])
    async pendingVotes(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.vote.findMany({
            where : {
                studentId : ctx.identity.studentId,
                status : "NOT_VOTED"
            }
        })
    }
    
    // @Query
}
