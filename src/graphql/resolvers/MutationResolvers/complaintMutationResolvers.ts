import {Authorized, Ctx, Mutation} from "type-graphql";
import { Arg } from "type-graphql";
// import {roles} from "../../../utility";
// import {Announcement} from "../../../graphql-schema";
// import {Context} from "../../../interface";
import { roles } from "../../utility";
import { Context } from "../../interface";
import { Complaint } from "../../graphql-schema";
import { ComplaintType } from "@prisma/client";

export class ComplaintMutationResolvers {

    @Authorized(roles.STUDENT_RESIDENT)
    @Mutation(returns => Complaint)
    async addComplaint(
        @Ctx() ctx: Context,
        @Arg('title') title: string,
        @Arg('details') details: string,
        @Arg('type') type: String,
    ) {
        let complaintType: ComplaintType;
        if (type.includes("resource")) {
            complaintType = ComplaintType.RESOURCE;
        } else if (type.includes("stuff")) {
            complaintType = ComplaintType.STUFF;
        } else if (type.includes("student")) {
            complaintType = ComplaintType.STUDENT;
        }

        if (!ctx.identity.studentId) {
            throw new Error("Not authorized to make complaints");
        }

        let newComplaint = await ctx.prisma.complaint.create({
            data: {
                title: title,
                details: details,
                type: complaintType,
                createdAt: new Date(),
                studentId: ctx.identity.studentId
            }
        });

        return newComplaint;
    }


    //     @Ctx() ctx: Context,
    //     @Arg('title') title: string,
    //     @Arg('details') details: string
    // ) {

    //     if (!ctx.identity.authorityId && !ctx.identity.messManagerId) {
    //         throw new Error("Not authorized to make announcements");
    //     }

    //     let newAnnouncement = await ctx.prisma.announcement.create({
    //         data: {
    //             title: title,
    //             details: details,
    //             createdAt: new Date(),
    //             authorityId: ctx.identity.authorityId ?? null,
    //             messManagerId: ctx.identity.messManagerId ?? null
    //         }
    //     });

    //     return newAnnouncement;
    // }

    // @Authorized(roles.PROVOST)
    // @Mutation(returns => Complaint)
    // async removeComlpaint(
    //     @Ctx() ctx: Context,
    //     @Arg('announcementId') announcementId: number
    // ) {
    //     let announcement = await ctx.prisma.announcement.findFirst({
    //         where: {
    //             announcementId: announcementId
    //         }
    //     });

    //     if (!announcement) {
    //         throw new Error("No such announcement found");
    //     }

    //     let deleted = await ctx.prisma.announcement.delete({
    //         where: {
    //             announcementId: announcementId
    //         }
    //     });

    //     return deleted;
    // }
}