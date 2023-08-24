import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AuthorityRole, ApplicationStatus, Authority, NewApplication, SeatChangeApplication, SeatApplication, TempApplication, AttachedFile, UploadedFile, FeedbackWithRating, RatingType, Feedback, MessManager, MealPlan } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => Feedback)
export class FeedbackResolver{

    // @FieldResolver(type => MessManager)
    // async messManager(
    //     @Ctx() ctx : Context,
    //     @Root() a : Feedback
    // ){
    //     return await ctx.prisma.messManager.findUnique({
    //         where : {
    //             messManagerId : a.messManagerId
    //         }
    //     })
    // }

    @FieldResolver(type => MealPlan)
    async startMealPlan(
        @Ctx() ctx : Context,
        @Root() a : Feedback
    ){
        return await ctx.prisma.mealPlan.findUnique({
            where : {
                mealPlanId : a.startMealPlanId
            }
        })
    }

    @FieldResolver(type => MealPlan)
    async endMealPlan(
        @Ctx() ctx : Context,
        @Root() a : Feedback
    ){
        return await ctx.prisma.mealPlan.findUnique({
            where : {
                mealPlanId : a.endMealPlanId
            }
        })
    }
    
    
}