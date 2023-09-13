import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {addDay, roles} from "../../../utility";
import {MessManager, MessManagerApplication, MessManagerApplicationCall} from "../../../graphql-schema";
import {Context} from "../../../interface";

export class MessManagerMutationResolvers {

    @Authorized(roles.STUDENT_RESIDENT)
    @Mutation(() => MessManagerApplication)
    async applyMessManager(
        @Ctx() ctx: Context,
        @Arg('callId') callId: number
    ) {


        let application = await ctx.prisma.messManagerApplication.findFirst({
            where: {
                residency: {
                    student: {
                        studentId: ctx.identity.studentId
                    }
                },
                callId: callId
            }
        });

        if (application) {
            throw new Error("Already applied for Mess Manager for this call");
        }

        let newApplication = await ctx.prisma.messManagerApplication.create({
            data: {
                appliedAt: new Date(),
                call: {
                    connect: {
                        callId: callId
                    }
                },
                residency: {
                    connect: {
                        studentId: ctx.identity.studentId
                    }
                }
            }
        });

        return newApplication;
    }

    @Authorized(roles.PROVOST)
    @Mutation(() => MessManager)
    async approveMessManagerApplication(
        @Ctx() ctx: Context,
        @Arg('messManagerApplicationId') messManagerApplicationId: number
    ) {
        let application = await ctx.prisma.messManagerApplication.findFirst({
            where: {
                applicationId: messManagerApplicationId
            },
            include: {
                call: true
            }
        });

        if (!application) {
            throw new Error("No such application found");
        }

        if (application.status != 'PENDING') {
            throw new Error("Invalid state of application");
        }

        let result = await ctx.prisma.$transaction([
            ctx.prisma.messManager.create({
                data: {
                    callId: application.call.callId,
                    residencyId: application.residencyId,
                    assingedAt: new Date()
                }
            }),
            ctx.prisma.messManagerApplication.update({
                where: {
                    applicationId: messManagerApplicationId
                },
                data: {
                    status: 'ACCEPTED'
                }
            })
        ])

        return result[0];
    }

    @Authorized(roles.PROVOST)
    @Mutation(() => MessManagerApplication)
    async rejectMessManagerApplication(
        @Ctx() ctx: Context,
        @Arg('messManagerApplicationId') messManagerApplicationId: number
    ) {
        let application = await ctx.prisma.messManagerApplication.findFirst({
            where: {
                applicationId: messManagerApplicationId
            }
        });

        if (!application) {
            throw new Error("No such application found");
        }

        if (application.status != 'PENDING') {
            throw new Error("Invalid state of application");
        }

        let result = await ctx.prisma.messManagerApplication.update({
            where: {
                applicationId: messManagerApplicationId
            },
            data: {
                status: 'REJECTED'
            }
        })

        return result;
    }

    @Mutation(() => MessManagerApplicationCall)
    async createCall(
        @Ctx() ctx: Context,
        @Arg('from') from: string,
        @Arg('to') to: string,
    ) {
        let fixedUpto = await ctx.prisma.messManagerApplicationCall.findFirst({
            orderBy: {
                to: "desc"
            }
        })
        let fromDate = new Date(from);
        let fixedUptoDate = new Date().toDateString();
        if (fixedUpto) {
            fixedUptoDate = fixedUpto.to.toDateString();
        }
        if (fromDate > addDay(fixedUptoDate)) {
            throw new Error("Gap in Calls");
        }
        return await ctx.prisma.messManagerApplicationCall.create({
            data: {
                from: new Date(from),
                to: new Date(to),
                createdById: ctx.identity.authorityId
            }
        })
    }
}