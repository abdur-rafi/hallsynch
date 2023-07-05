import {Authorized, Ctx, Query, Resolver} from 'type-graphql'
import { Department, SeatApplication, Student } from '../graphql-schema'
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
    // @Query
}
