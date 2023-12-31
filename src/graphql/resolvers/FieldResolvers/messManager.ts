import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Announcement, MessManager, MessManagerApplicationCall, Residency, Student} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => MessManager)
export class MessManagerResolver{

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

    @FieldResolver(type => Residency)
    async residency(
        @Ctx() ctx : Context,
        @Root() messManager : MessManager
    ){
        return ctx.prisma.residency.findUnique({
            where : {
                residencyId : messManager.residencyId
            }
        });
    }

    @FieldResolver(type => MessManagerApplicationCall)
    async call(
        @Ctx() ctx : Context,
        @Root() messManager : MessManager
    ){
        return ctx.prisma.messManagerApplicationCall.findUnique({
            where : {
                callId : messManager.callId
            }
        });
    }
}