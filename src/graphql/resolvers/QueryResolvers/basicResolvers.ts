import {Ctx, Query} from "type-graphql";
import {Batch, Department, LevelTerm, UserWithToken} from "../../graphql-schema";
import {Context} from "../../interface";


export class basicResolver {

    @Query(returns => String)
    test(){
        return 'Hello world'
    }

    @Query(retunrs => UserWithToken)
    async selfInfo(
        @Ctx() ctx : Context
    ){
        if(!ctx.identity)
            throw new Error("Not authenticated");
        let student = undefined;
        if(ctx.identity.studentId){
            student = await ctx.prisma.student.findUnique({
                where : {studentId : ctx.identity.studentId}
            })
        }
        let authority = undefined;
        if(ctx.identity.authorityId){
            authority = await ctx.prisma.authority.findUnique({
                where : {authorityId : ctx.identity.authorityId}
            })
        }
        return {
            authority : authority,
            student : student,
            token : ''
        }
    }

    @Query(returns => [Department])
    async departments(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.department.findMany();
    }

    @Query(returns => [LevelTerm])
    async levelTerms(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.levelTerm.findMany();
    }

    @Query(returns => [Batch])
    async batches(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.batch.findMany({
            orderBy : {
                year : 'asc'
            }
        })
    }
}