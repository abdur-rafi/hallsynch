import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Batch, Department, LevelTerm, Residency, ResidencyStatus, Room, Seat, Student } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => Seat)
export class SeatResolver{

    @FieldResolver(type => Room)
    async room(
        @Ctx() ctx : Context,
        @Root() seat : Seat
    ){
        return await ctx.prisma.room.findUnique({
            where : {
                roomId : seat.roomId
            }
        })
    }

    @FieldResolver(type => Room)
    async residency(
        @Ctx() ctx : Context,
        @Root() seat : Seat
    ){
        return await ctx.prisma.residency.findUnique({
            where : {
                seatId : seat.seatId
            }
        })
    }
}