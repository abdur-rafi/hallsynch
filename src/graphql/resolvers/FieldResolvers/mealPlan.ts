import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {CupCount, Meal, MealPlan, MealTime, Preference, Student} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => MealPlan)
export class MealPlanResolver{

    @FieldResolver(type => MealTime)
    async mealTime(
        @Ctx() ctx : Context,
        @Root() mealPlanCls : MealPlan
    ){
        return MealTime[mealPlanCls.mealTime];
    }

    @FieldResolver(type => Meal)
    async meal(
        @Ctx() ctx : Context,
        @Root() mealPlanCls : MealPlan
    ){
        return await ctx.prisma.meal.findUnique({
            where: {
                mealId: mealPlanCls.mealId
            }
        });
    }

    @FieldResolver(type => [CupCount])
    async cupCount(
        @Ctx() ctx : Context,
        @Root() mealPlanCls : MealPlan
    ){
        return await ctx.prisma.cupCount.findMany({
            where: {
                mealPlanId: mealPlanCls.mealPlanId
            }
        });
    }

    @FieldResolver(type => [Preference])
    async preferences(
        @Ctx() ctx : Context,
        @Root() mealPlanCls : MealPlan
    ){
        return await ctx.prisma.preference.findMany({
            where: {
                mealPlanId: mealPlanCls.mealPlanId
            }
        });
    }

    @FieldResolver(type => [Student])
    async optedOut(
        @Ctx() ctx : Context,
        @Root() mealPlanCls : MealPlan
    ){
        return await ctx.prisma.optedOut.findMany({
            where: {
                mealPlanId: mealPlanCls.mealPlanId
            }
        });
    }
}