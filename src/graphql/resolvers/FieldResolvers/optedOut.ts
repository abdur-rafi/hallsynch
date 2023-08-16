import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {MealPlan, OptedOut, Residency} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => OptedOut)
export class OptedOutResolver{

    @FieldResolver(type => MealPlan)
    async mealPlan(
        @Ctx() ctx : Context,
        @Root() optedOutCls : OptedOut
    ){
        return await ctx.prisma.mealPlan.findFirst({
            where: {
                mealPlanId: optedOutCls.mealPlanId
            }
        });
    }

    @FieldResolver(type => Residency)
    async residency(
        @Ctx() ctx : Context,
        @Root() optedOutCls : OptedOut
    ){
        return await ctx.prisma.residency.findFirst({
            where: {
                residencyId: optedOutCls.residencyId
            }
        });
    }
}