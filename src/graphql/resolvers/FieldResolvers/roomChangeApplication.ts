import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AttachedFiles, Batch, Department, NewApplication, NewSeatQuestionnaire, ResidencyStatus, Room, RoomChangeApplication, SeatApplication, Student, TempApplication, TempQuestionnaire, Vote } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => RoomChangeApplication)
export class RoomChangeApplicationResolver{

    @FieldResolver(type => SeatApplication)
    async application(
        @Ctx() ctx : Context,
        @Root() app : RoomChangeApplication
    ){
        return await ctx.prisma.seatApplication.findUnique({
            where : {
                applicationId : app.applicationId
            }
        })
    }

    @FieldResolver(type => Room)
    async toRoom(
        @Ctx() ctx : Context,
        @Root() app : RoomChangeApplication

    ){
        return await ctx.prisma.room.findUnique({
            where : {
                roomId : app.toRoomId
            }
        })
    }

    @FieldResolver(type => [Vote])
    async votes(
        @Ctx() ctx : Context,
        @Root() app : RoomChangeApplication

    ){
        return await ctx.prisma.vote.findMany({
            where : {
                roomChangeApplicationId : app.roomChangeApplicationId
            }
        })
    }
    
    
}