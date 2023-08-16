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
        return await ctx.prisma.item.findMany({
            where: {
                itemId: mealCls.mealId
            }
        });
    }

    @FieldResolver(type => [MealPlan])
    async mealPlans(
        @Ctx() ctx : Context,
        @Root() mealCls : Meal
    ){
        return await ctx.prisma.mealPlan.findMany({
            where: {
                mealId: mealCls.mealId
            }
        });
    }
}