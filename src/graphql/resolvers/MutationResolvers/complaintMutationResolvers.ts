import {Authorized, Ctx, Mutation} from "type-graphql";
import { Arg } from "type-graphql";
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
        if (type.toLowerCase().includes("resource")) {
            complaintType = ComplaintType.RESOURCE;
        } else if (type.toLowerCase().includes("stuff")) {
            complaintType = ComplaintType.STUFF;
        } else if (type.toLowerCase().includes("student")) {
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
}