import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Item, MealPlan, Preference, Student} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => Preference)
export class PreferenceResolver{

    @FieldResolver(type => MealPlan)
    async mealPlan(
        @Ctx() ctx : Context,
        @Root() preferenceCls : Preference
    ){
        return await ctx.prisma.mealPlan.findFirst({
            where: {
                mealPlanId: preferenceCls.mealPlanId
            }
        });
    }

    @FieldResolver(type => Item)
    async item(
        @Ctx() ctx : Context,
        @Root() preferenceCls : Preference
    ){
        return await ctx.prisma.item.findFirst({
            where: {
                itemId: preferenceCls.itemId
            }
        });
    }

    @FieldResolver(type => Student)
    async student(
        @Ctx() ctx : Context,
        @Root() preferenceCls : Preference
    ){
        return await ctx.prisma.student.findFirst({
            where: {
                studentId: preferenceCls.studentId
            }
        });
    }
}