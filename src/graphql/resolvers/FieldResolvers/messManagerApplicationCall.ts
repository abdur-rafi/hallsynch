import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Announcement, Authority, MessManager, MessManagerApplication, MessManagerApplicationCall} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => MessManagerApplicationCall)
export class MessManagerApplicationCallResolver{

    @FieldResolver(type => Authority)
    async authority(
        @Ctx() ctx : Context,
        @Root() app : MessManagerApplicationCall
    ){
        return await ctx.prisma.authority.findUnique({
            where : {
                authorityId : app.createdById
            }
        })
    }

    @FieldResolver(type => Number)
    async applicationsCount(
        @Ctx() ctx : Context,
        @Root() app : MessManagerApplicationCall
    ){
        return await ctx.prisma.messManagerApplication.count({
            where : {
                callId : app.callId
            }
        })
    }


    @FieldResolver(type => Number)
    async accepted(
        @Ctx() ctx : Context,
        @Root() app : MessManagerApplicationCall
    ){
        return await ctx.prisma.messManagerApplication.count({
            where : {
                callId : app.callId,
                status : 'ACCEPTED'
            }
        })
    }

    
    
    @FieldResolver(type => [MessManagerApplication])
    async applications(
        @Ctx() ctx : Context,
        @Root() app : MessManagerApplicationCall
    ){
        return await ctx.prisma.messManagerApplication.findMany({
            where : {
                callId : app.callId
            }
        })
    }


}