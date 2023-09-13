import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {roles} from "../../../utility";
import {Announcement} from "../../../graphql-schema";
import {Context} from "../../../interface";

export class AnnouncementMutationResolvers {

    @Authorized(roles.STUDENT_MESS_MANAGER || roles.PROVOST)
    @Mutation(() => Announcement)
    async addAnnouncement(
        @Ctx() ctx: Context,
        @Arg('title') title: string,
        @Arg('details') details: string
    ) {

        if (!ctx.identity.authorityId && !ctx.identity.messManagerId) {
            throw new Error("Not authorized to make announcements");
        }

        let newAnnouncement = await ctx.prisma.announcement.create({
            data: {
                title: title,
                details: details,
                createdAt: new Date(),
                authorityId: ctx.identity.authorityId ?? null,
                messManagerId: ctx.identity.messManagerId ?? null
            }
        });

        return newAnnouncement;
    }

    @Authorized(roles.STUDENT_MESS_MANAGER || roles.PROVOST)
    @Mutation(() => Announcement)
    async removeAnnouncement(
        @Ctx() ctx: Context,
        @Arg('announcementId') announcementId: number
    ) {
        let announcement = await ctx.prisma.announcement.findFirst({
            where: {
                announcementId: announcementId
            }
        });

        if (!announcement) {
            throw new Error("No such announcement found");
        }

        let deleted = await ctx.prisma.announcement.delete({
            where: {
                announcementId: announcementId
            }
        });

        return deleted;
    }
}