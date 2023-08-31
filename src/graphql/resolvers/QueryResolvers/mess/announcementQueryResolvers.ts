import {Arg, Authorized, Ctx, Query} from "type-graphql";
import {roles} from "../../../utility";
import {Announcement} from "../../../graphql-schema";
import {Context} from "../../../interface";

export class AnnouncementQueryResolvers {

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [Announcement])
    async getAnnouncements(
        @Ctx() ctx: Context,
    ) {
        return await ctx.prisma.announcement.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => Announcement)
    async getAnnouncement(
        @Ctx() ctx: Context,
        @Arg('announcementId') announcementId: number
    ) {
        return await ctx.prisma.announcement.findFirst({
            where: {
                announcementId: announcementId
            }
        });
    }
}