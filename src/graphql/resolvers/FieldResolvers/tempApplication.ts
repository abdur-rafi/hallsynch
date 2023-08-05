import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AttachedFile, Batch, Department, NewApplication, NewSeatQuestionnaire, ResidencyStatus, Room, Seat, SeatApplication, Student, TempApplication, TempQuestionnaire } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => TempApplication)
export class TempApplicationResolver{

    @FieldResolver(type => SeatApplication)
    async application(
        @Ctx() ctx : Context,
        @Root() tempApp : TempApplication
    ){
        return await ctx.prisma.seatApplication.findUnique({
            where : {
                applicationId : tempApp.applicationId
            }
        })
    }

    @FieldResolver(type => TempQuestionnaire)
    async questionnaire(
        @Ctx() ctx : Context,
        @Root() tempApp : TempApplication
        
    ){
        return await ctx.prisma.tempQuestionnaire.findUnique({
            where : {
                questionnaireId : tempApp.questionnaireId
            }
        })
    }

    @FieldResolver(type => Seat)
    async prefSeat(
        @Ctx() ctx : Context,
        @Root() tempApp : TempApplication

    ){
        return await ctx.prisma.seat.findUnique({
            where : {
                seatId : tempApp.prefSeatId
            }
        })
    }
    
}