import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AttachedFiles, Batch, Department, NewApplication, NewSeatQuestionnaire, ResidencyStatus, SeatApplication, Student } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => NewApplication)
export class NewApplicationResolver{

    @FieldResolver(type => SeatApplication)
    async application(
        @Ctx() ctx : Context,
        @Root() newApp : NewApplication
    ){
        return await ctx.prisma.seatApplication.findUnique({
            where : {
                applicationId : newApp.applicationId
            }
        })
    }

    @FieldResolver(type => NewSeatQuestionnaire)
    async questionnaire(
        @Ctx() ctx : Context,
        @Root() newApp : NewApplication
    ){
        return await ctx.prisma.newSeatQuestionnaire.findUnique({
            where : {
                questionnaireId : newApp.questionnaireId
            }
        })
    }

    // @FieldResolver(type => [AttachedFiles])
    // async attachedFiles(
    //     @Ctx() ctx : Context,
    //     @Root() newApp : NewApplication
    // ){
    //     return await ctx.prisma.attachedFiles.findMany({
    //         where : {
    //             newApplicationId : newApp.newApplicationId
    //         }
    //     })
    // }
    
}