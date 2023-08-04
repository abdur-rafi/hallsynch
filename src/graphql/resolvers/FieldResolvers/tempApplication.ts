import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AttachedFile, Batch, Department, NewApplication, NewSeatQuestionnaire, ResidencyStatus, Room, SeatApplication, Student, TempApplication, TempQuestionnaire } from "../../graphql-schema";
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

    @FieldResolver(type => Room)
    async prefRoom(
        @Ctx() ctx : Context,
        @Root() tempApp : TempApplication

    ){
        return await ctx.prisma.room.findUnique({
            where : {
                roomId : tempApp.prefRoomId
            }
        })
    }
    
}