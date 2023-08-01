import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Batch, Department, Floor, LevelTerm, Residency, ResidencyStatus, Room, Seat, Student } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => Room)
export class RoomResolver{

    @FieldResolver(type => Floor)
    async floor(
        @Ctx() ctx : Context,
        @Root() room : Room
    ){
        return await ctx.prisma.floor.findUnique({
            where : {
                floorId : room.floorId
            }
        })
    }

    @FieldResolver(type => [Seat])
    async seats(
        @Ctx() ctx : Context,
        @Root() room : Room
    ){
        return await ctx.prisma.seat.findMany({
            where : {
                roomId : room.roomId
            }
        })
    }

    
}