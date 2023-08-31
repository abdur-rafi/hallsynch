import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Context } from "../../interface";
import { Notification, Student, Vote } from "../../graphql-schema";

@Resolver(of => Notification)
export class NotificationResolver{

    @FieldResolver(type => Vote)
    async vote(
        @Ctx() ctx : Context,
        @Root() noti : Notification
    ){
        if(noti.voteId == null) return null;
        return await ctx.prisma.vote.findUnique({
            where : {
                voteId : noti.voteId
            }
        })
    }


    @FieldResolver(type => Student)
    async student(
        @Ctx() ctx : Context,
        @Root() noti : Notification
    ){
        return await ctx.prisma.student.findUnique({
            where : {
                studentId : noti.studentId
            }
        })
    }
    
    
}