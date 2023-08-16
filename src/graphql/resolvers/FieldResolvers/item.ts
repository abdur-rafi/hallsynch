import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Item, ItemType, Meal, Photo} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => Item)
export class ItemResolver{

    @FieldResolver(type => ItemType)
    async type(
        @Ctx() ctx : Context,
        @Root() itemCls : Item
    ){
        return ItemType[itemCls.type];
    }

    @FieldResolver(type => Photo)
    async photo(
        @Ctx() ctx : Context,
        @Root() itemCls : Item
    ){
        if(itemCls.photoId == null) return null;
        return await ctx.prisma.photo.findFirst({
            where: {
                photoId: itemCls.photoId
            }
        });
    }

    @FieldResolver(type => [Meal])
    async meals(
        @Ctx() ctx : Context,
        @Root() itemCls : Item
    ){
        return await ctx.prisma.meal.findMany({
            where: {
                mealId: itemCls.itemId
            }
        });
    }
}