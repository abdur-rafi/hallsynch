import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Batch, Department, LevelTerm, Residency, ResidencyStatus, Room, Seat, Student, TempResidency } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => TempResidency)
export class TempResidencyResolver{

    @FieldResolver(type => Student)
    async student(
        @Ctx() ctx : Context,
        @Root() residency : TempResidency
    ){
        return await ctx.prisma.student.findUnique({
            where : {
                studentId : residency.studentId
            }
        })
    }

    @FieldResolver(type => Seat)
    async seat(
        @Ctx() ctx : Context,
        @Root() residency : TempResidency
    ){
        return await ctx.prisma.seat.findUnique({
            where : {
                seatId : residency.seatId
            }
        })
    }
}