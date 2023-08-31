import {Arg, Authorized, Ctx, Query} from "type-graphql";
import {roles} from "../../../utility";
import {Item, MealPlan} from "../../../graphql-schema";
import {Context} from "../../../interface";
import {MealTime} from "@prisma/client";

export class MealQueryResolvers {

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => MealPlan)
    async getMealPlan(
        @Ctx() ctx: Context,
        @Arg('date') date : string,
        @Arg('mealTime') mealtime : string
    ) {

        let mealTime : MealTime;
        if(mealtime.toLowerCase() == 'lunch') mealTime = MealTime.LUNCH;
        else mealTime = MealTime.DINNER;

        let res = await ctx.prisma.mealPlan.findFirst({
            where: {
                day: new Date(date),
                mealTime: mealTime
            }
        });

        if(!res) throw new Error("Meal plan not found");
        return res;
    }

    // get multiple meal plans for student view
    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [MealPlan])
    async getMealPlans(
        @Ctx() ctx: Context,
        @Arg('from') from : string,
        @Arg('to') to : string
    ) {
        return await ctx.prisma.mealPlan.findMany({
            where: {
                day: {
                    gte: new Date(from),
                    lte: new Date(to)
                }
            },
            orderBy: [
                {
                    day: 'asc',
                },
                {
                    mealTime: 'asc'
                }
            ]
        });
    }

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [Item])
    async getOldItems(
        @Ctx() ctx: Context,
    ) {
        return await ctx.prisma.item.findMany();
    }
}