import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Announcement, Authority, MessManager} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => Announcement)
export class AnnouncementResolver{

    @FieldResolver(type => Authority)
    async authority(
        @Ctx() ctx : Context,
        @Root() announcement : Announcement
    ){
        if(announcement.authorityId === null) return null;
        return ctx.prisma.authority.findUnique({
            where : {
                authorityId : announcement.authorityId
            }
        });
    }

    @FieldResolver(type => MessManager)
    async messManager(
        @Ctx() ctx : Context,
        @Root() announcement : Announcement
    ){
        if(announcement.messManagerId === null) return null;
        return ctx.prisma.messManager.findUnique({
            where : {
                messManagerId : announcement.messManagerId
            }
        });
    }
}