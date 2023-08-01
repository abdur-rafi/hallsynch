import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Batch, Department, Floor, LevelTerm, Residency, ResidencyStatus, Room, Seat, Student } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => Floor)
export class FloorResolver{

    @FieldResolver(type => [Room])
    async rooms(
        @Ctx() ctx : Context,
        @Root() floor : Floor
    ){
        return await ctx.prisma.room.findMany({
            where : {
                floorId : floor.floorId
            }
        })
    }

    
}