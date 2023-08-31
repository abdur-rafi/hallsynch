import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AttachedFile, Batch, Department, NewApplication, NewSeatQuestionnaire, ResidencyStatus, Room, SeatChangeApplication, SeatApplication, Student, TempApplication, TempQuestionnaire, Vote, VoteStatus } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => Vote)
export class VoteResolver{


    @FieldResolver(type => VoteStatus)
    async status(
        @Ctx() ctx : Context,
        @Root() vote : Vote
    ){
        return VoteStatus[vote.status];
    }

    @FieldResolver(type => SeatChangeApplication)
    async seatChangeApplication(
        @Ctx() ctx : Context,
        @Root() vote : Vote
    ){
        console.log(vote)
        return await ctx.prisma.seatChangeApplication.findUnique({
            where : {
                seatChangeApplicationId : vote.seatChangeApplicationId
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