import {Ctx, Query, Resolver} from 'type-graphql'
import { Department, Student } from '../graphql-schema'
import { Context } from '../interface'
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

    // @Query
}
