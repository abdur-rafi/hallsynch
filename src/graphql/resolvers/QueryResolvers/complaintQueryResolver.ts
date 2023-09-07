import {Arg, Authorized, Ctx, Query} from "type-graphql";
// import {roles} from "../../../utility";
// import {Announcement} from "../../../graphql-schema";
// import {Context} from "../../../interface";
import { roles } from "../../utility";
import { Context } from "../../interface";
import { Complaint } from "../../graphql-schema";
import { ComplaintType } from "@prisma/client";

export class ComplaintQueryResolvers {

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [Complaint])
    async getComplaints(
        @Ctx() ctx: Context,
    ) {
        return await ctx.prisma.complaint.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => Complaint)
    async getComplaint(
        @Ctx() ctx: Context,
        @Arg('complaintId') complaintId: number
    ) {
        return await ctx.prisma.complaint.findFirst({
            where: {
                complainId: complaintId
            }
        });
    }

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [Complaint])
    async getComplaintsByStudent(
        @Ctx() ctx: Context,
        @Arg('studentId') studentId: number
    ) {
        return await ctx.prisma.complaint.findMany({
            where: {
                studentId: studentId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [Complaint])
    async getComplaintsByType(
        @Ctx() ctx: Context,
        @Arg('type') type: ComplaintType
    ) {
        return await ctx.prisma.complaint.findMany({
            where: {
                type: type
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [Complaint])
    async getComplaintsByTypeAndStudent(
        @Ctx() ctx: Context,
        @Arg('type') type: ComplaintType,
        @Arg('studentId') studentId: number
    ) {
        return await ctx.prisma.complaint.findMany({
            where: {
                type: type,
                studentId: studentId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

}