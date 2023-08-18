import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Item, Meal, MealPlan} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => Meal)
export class MealResolver{

    @FieldResolver(type => [Item])
    async items(
        @Ctx() ctx : Context,
        @Root() mealCls : Meal
    ){
        let res = await ctx.prisma.meal.findUnique({
            where : {
                mealId : mealCls.mealId
            },
            include : {
                items : true
            }
        })
        return res.items;
    }

    @FieldResolver(type => [MealPlan])
    async mealPlans(
        @Ctx() ctx : Context,
        @Root() mealCls : Meal
    ){
        let res = await ctx.prisma.meal.findUnique({
            where : {
                mealId : mealCls.mealId
            },
            include : {
                mealPlans : true
            }
        })
        return res.mealPlans;
    }
}