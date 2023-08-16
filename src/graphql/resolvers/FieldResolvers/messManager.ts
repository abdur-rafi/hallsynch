import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Announcement, MessManager, Student} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => MessManager)
export class MessManagerResolver{

    @FieldResolver(type => Student)
    async student(
        @Ctx() ctx : Context,
        @Root() messManager : MessManager
    ){
        if(!messManager) return null;
        let res = await ctx.prisma.residency.findFirst({
            where : {
                residencyId : messManager.residencyId
            },
            include : {
                student : true
            }
        });
        return res.student;
    }

    @FieldResolver(type => [Announcement])
    async announcements(
        @Ctx() ctx : Context,
        @Root() messManager : MessManager
    ){
        return ctx.prisma.announcement.findMany({
            where : {
                messManagerId: messManager.messManagerId
            }
        });
    }
}