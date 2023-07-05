import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Batch, Department, LevelTerm, Residency, ResidencyStatus, Room, Student } from "../../graphql-schema";
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

    @FieldResolver(type => Room)
    async room(
        @Ctx() ctx : Context,
        @Root() residency : Residency
    ){
        return await ctx.prisma.room.findUnique({
            where : {
                roomId : residency.roomId
            }
        })
    }
}