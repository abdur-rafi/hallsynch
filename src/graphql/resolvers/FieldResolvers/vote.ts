import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AttachedFiles, Batch, Department, NewApplication, NewSeatQuestionnaire, ResidencyStatus, Room, RoomChangeApplication, SeatApplication, Student, TempApplication, TempQuestionnaire, Vote } from "../../graphql-schema";
import { Context } from "../../interface";
import { VoteStatus } from "@prisma/client";

@Resolver(of => Vote)
export class VoteResolver{


    @FieldResolver(type => VoteStatus)
    async status(
        @Ctx() ctx : Context,
        @Root() vote : Vote
    ){
        return VoteStatus[vote.status];
    }

    @FieldResolver(type => RoomChangeApplication)
    async roomChangeApplication(
        @Ctx() ctx : Context,
        @Root() vote : Vote
    ){
        return await ctx.prisma.roomChangeApplication.findUnique({
            where : {
                applicationId : vote.roomChangeApplicationId
            }
        })
    }

    @FieldResolver(type => Student)
    async student(
        @Ctx() ctx : Context,
        @Root() vote : Vote
    ){
        return await ctx.prisma.student.findUnique({
            where : {
                studentId : vote.studentId
            }
        })
    }

    
}