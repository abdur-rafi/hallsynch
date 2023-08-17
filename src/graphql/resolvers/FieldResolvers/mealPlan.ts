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
        let residency = await ctx.prisma.residency.findUnique({
               where: {
                   studentId: ctx.identity.studentId
               }
        });

        return await ctx.prisma.preference.findMany({
            where: {
                mealPlanId: mealPlanCls.mealPlanId,
                residencyId: residency.residencyId
            }
        });
    }

    @FieldResolver(type => Student)
    async optedOut(
        @Ctx() ctx : Context,
        @Root() mealPlanCls : MealPlan
    ){
        let residency = await ctx.prisma.residency.findUnique({
            where: {
                studentId: ctx.identity.studentId
            }
        });

        let res = await ctx.prisma.optedOut.findFirst({
            where: {
                mealPlanId: mealPlanCls.mealPlanId,
                residencyId: residency.residencyId
            }
        });

        if(res) {
            return await ctx.prisma.student.findUnique({
                where: {
                    studentId: ctx.identity.studentId
                }
            });
        }
        return null;
    }
}