import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Seat, TempResidency, TempResidencyHistory} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => TempResidencyHistory)
export class TempResidencyHistoryResolver{
    @FieldResolver(type => Seat)
    async seat(
        @Ctx() ctx : Context,
        @Root() residencyHistory : TempResidencyHistory
    ){
        return await ctx.prisma.seat.findUnique({
            where : {
                seatId : residencyHistory.seatId
            }
        })
    }
}