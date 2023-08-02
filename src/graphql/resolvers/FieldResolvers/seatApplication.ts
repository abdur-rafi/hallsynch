import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ApplicationStatus, NewApplication, SeatChangeApplication, SeatApplication, Student, TempApplication } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => SeatApplication)
export class SeatApplicationResolver{

    @FieldResolver(type => ApplicationStatus)
    async status(
        @Ctx() ctx : Context,
        @Root() app : SeatApplication
    ){
        return ApplicationStatus[app.status];
    }

   
    @FieldResolver(type => NewApplication, {nullable : true})
    async newApplication(
        @Ctx() ctx : Context,
        @Root() app : SeatApplication
    ){
        return await ctx.prisma.newApplication.findUnique({
            where : {
                applicationId : app.applicationId
            }
        })
    }

    @FieldResolver(type => TempApplication, {nullable : true})
    async tempApplication(
        @Ctx() ctx : Context,
        @Root() app : SeatApplication
    ){
        return await ctx.prisma.tempApplication.findUnique({
            where : {
                applicationId : app.applicationId
            }
        })
    }

    @FieldResolver(type => SeatChangeApplication, {nullable : true})
    async seatChangeApplication(
        @Ctx() ctx : Context,
        @Root() app : SeatApplication
    ){
        return await ctx.prisma.seatChangeApplication.findUnique({
            where : {
                applicationId : app.applicationId
            }
        })
    }
    
    @FieldResolver(type => Student)
    async student(
        @Ctx() ctx : Context,
        @Root() app : SeatApplication
    ){
        return await ctx.prisma.student.findUnique({
            where : {
                studentId : app.studentId
            }
        })
    }
    
    
}