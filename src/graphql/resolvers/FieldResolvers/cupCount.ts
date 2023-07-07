import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {CupCount, Item, MealPlan} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => CupCount)
export class CupCountResolver{

    @FieldResolver(type => Item)
    async item(
        @Ctx() ctx : Context,
        @Root() cupCountCls : CupCount
    ){
        return await ctx.prisma.item.findUnique({
            where: {
                itemId: cupCountCls.itemId
            }
        });
    }

    @FieldResolver(type => MealPlan)
    async mealPlan(
        @Ctx() ctx : Context,
        @Root() cupCountCls : CupCount
    ){
        return await ctx.prisma.mealPlan.findUnique({
            where: {
                mealPlanId: cupCountCls.mealPlanId
            }
        });
    }

}