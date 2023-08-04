import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AttachedFile, Batch, Department, NewApplication, NewSeatQuestionnaire, ResidencyStatus, Room, SeatChangeApplication, SeatApplication, Student, TempApplication, TempQuestionnaire, Vote, Seat } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => SeatChangeApplication)
export class SeatChangeApplicationResolver{

    @FieldResolver(type => SeatApplication)
    async application(
        @Ctx() ctx : Context,
        @Root() app : SeatChangeApplication
    ){
        return await ctx.prisma.seatApplication.findUnique({
            where : {
                applicationId : app.applicationId
            }
        })
    }

    @FieldResolver(type => Seat)
    async toSeat(
        @Ctx() ctx : Context,
        @Root() app : SeatChangeApplication

    ){
        return await ctx.prisma.seat.findUnique({
            where : {
                seatId : app.toSeatId
            }
        })
    }

    @FieldResolver(type => [Vote])
    async votes(
        @Ctx() ctx : Context,
        @Root() app : SeatChangeApplication

    ){
        return await ctx.prisma.vote.findMany({
            where : {
                seatChangeApplicationId : app.seatChangeApplicationId
            }
        })
    }

    
    
    
}