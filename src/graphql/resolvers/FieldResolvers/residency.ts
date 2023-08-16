import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Batch, Department, LevelTerm, Residency, ResidencyStatus, Room, Seat, Student } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => Residency)
export class ResidencyResolver{

    @FieldResolver(type => Student)
    async student(
        @Ctx() ctx : Context,
        @Root() residency : Residency
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
        @Root() residency : Residency
    ){
        return await ctx.prisma.seat.findUnique({
            where : {
                seatId : residency.seatId
            }
        })
    }

    @FieldResolver(type => Boolean)
    async isCurrentMessManager(
        @Ctx() ctx : Context,
        @Root() residency : Residency
    ){
        let manager = await ctx.prisma.messManager.findFirst({
            where : {
                residencyId : residency.residencyId
            }
        })
        return manager != null;
    }
}