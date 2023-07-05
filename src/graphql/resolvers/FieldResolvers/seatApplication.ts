import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ApplicationStatus, NewApplication, SeatApplication } from "../../graphql-schema";
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

   
    @FieldResolver(type => NewApplication)
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
    
}