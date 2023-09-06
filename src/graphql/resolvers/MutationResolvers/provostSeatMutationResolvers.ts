import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {roles} from "../../utility";
import {Residency, Revision, SeatApplication, TempResidency} from "../../graphql-schema";
import {Context} from "../../interface";

export class provostSeatMutationResolver {

    @Authorized(roles.PROVOST)
    @Mutation(returns => Residency)
    async approveNewApplication(
        @Ctx() ctx : Context,
        @Arg('newApplicationId') newApplicationId : number,
        @Arg('seatId') seatId : number
    ){
        let newApplication = await ctx.prisma.newApplication.findUnique({
            where :  {
                newApplicationId : newApplicationId
            },
            include :{
                application : true
            }
        })
        if(newApplication.application.status != 'PENDING'){
            throw new Error("Invalid state of application");
        }

        let result = await ctx.prisma.$transaction([
            ctx.prisma.residency.create({
                data : {
                    from : new Date(),
                    seatId : seatId,
                    studentId : newApplication.application.studentId
                }
            }),
            ctx.prisma.applicationApproveHistory.create({
                data : {
                    applicationId : newApplication.application.applicationId,
                    seatId : seatId,
                    authorityId : ctx.identity.authorityId
                }
            }),
            ctx.prisma.seatApplication.update({
                where : {
                    applicationId : newApplication.application.applicationId
                },
                data : {
                    status : 'ACCEPTED'
                }
            }),
            ctx.prisma.student.update({
                where : {
                    studentId : newApplication.application.studentId
                },
                data : {
                    residencyStatus : 'RESIDENT'
                }
            }),
            ctx.prisma.notification.create({
                data : {
                    text : "Your application has been accepted",
                    applicationId : newApplication.application.applicationId,
                    studentId : newApplication.application.studentId
                }
            })
        ])

        return result[0];


    }

    @Authorized(roles.PROVOST)
    @Mutation(returns => SeatApplication)
    async rejectApplication(
        @Ctx() ctx : Context,
        @Arg('applicationId') applicationId : number
    ){
        let application = await ctx.prisma.seatApplication.findUnique({
            where :  {
                applicationId : applicationId
            }
        })
        if(application.status != 'PENDING'){
            throw new Error("Invalid state of application");
        }

        let result = await ctx.prisma.$transaction([
            ctx.prisma.seatApplication.update({
                where : {
                    applicationId : application.applicationId
                },
                data : {
                    status : 'REJECTED'
                }
            }),
            ctx.prisma.rejectionHistory.create({
                data : {
                    applicationId : application.applicationId,
                    authorityId : ctx.identity.authorityId
                }
            }),
            ctx.prisma.notification.create({
                data : {
                    text : "Your application has been rejected",
                    studentId : application.studentId,
                    applicationId : application.applicationId
                }
            })
        ])

        return result[0];


    }


    @Authorized(roles.PROVOST)
    @Mutation(returns => Residency)
    async approveSeatChangeApplication(
        @Ctx() ctx : Context,
        @Arg('seatChangeApplicationId') seatChangeApplicationId : number,
        @Arg('seatId') seatId : number
    ){
        let seatChangeApplication = await ctx.prisma.seatChangeApplication.findUnique({
            where :  {
                seatChangeApplicationId : seatChangeApplicationId
            },
            include :{
                application : true
            }
        })
        if(seatChangeApplication.application.status != 'PENDING'){
            throw new Error("Invalid state of application");
        }

        let result = await ctx.prisma.$transaction([
            ctx.prisma.residency.update({
                where : {
                    studentId : seatChangeApplication.application.studentId
                },
                data : {
                    seatId : seatId
                }
            }),
            ctx.prisma.applicationApproveHistory.create({
                data : {
                    applicationId : seatChangeApplication.application.applicationId,
                    seatId : seatId,
                    authorityId : ctx.identity.authorityId
                }
            }),
            ctx.prisma.seatApplication.update({
                where : {
                    applicationId : seatChangeApplication.application.applicationId
                },
                data : {
                    status : 'ACCEPTED'
                }
            }),
            ctx.prisma.notification.create({
                data : {
                    text : "Your application has been accepted",
                    applicationId : seatChangeApplication.application.applicationId,
                    studentId : seatChangeApplication.application.studentId
                }
            })
        ])

        return result[0];

    }



    @Authorized(roles.PROVOST)
    @Mutation(returns => TempResidency)
    async approveTempSeatApplication(
        @Ctx() ctx : Context,
        @Arg('applicationId') applicationId : number,
        @Arg('seatId') seatId : number,
        @Arg('days') days : number,
        @Arg('from') from : string
    ){
        let application = await ctx.prisma.seatApplication.findUnique({
            where :  {
                applicationId : applicationId
            }
        })
        if(application.status != 'PENDING'){
            throw new Error("Invalid state of application");
        }

        let result = await ctx.prisma.$transaction([
            ctx.prisma.tempResidency.create({
                data : {
                    from : from,
                    seatId : seatId,
                    studentId : application.studentId,
                    days : days
                }
            }),
            ctx.prisma.applicationApproveHistory.create({
                data : {
                    applicationId : application.applicationId,
                    seatId : seatId,
                    authorityId : ctx.identity.authorityId
                }
            }),
            ctx.prisma.seatApplication.update({
                where : {
                    applicationId : application.applicationId
                },
                data : {
                    status : 'ACCEPTED'
                }
            }),
            ctx.prisma.student.update({
                where : {
                    studentId : application.studentId
                },
                data : {
                    residencyStatus : 'TEMP_RESIDENT'
                }
            }),
            ctx.prisma.notification.create({
                data : {
                    text : "Your application has been accepted",
                    applicationId : application.applicationId,
                    studentId : application.studentId
                }
            })
        ])

        return result[0];
    }


    @Authorized(roles.PROVOST)
    @Mutation(returns => Revision)
    async reviseApplication(
        @Ctx() ctx : Context,
        @Arg('applicationId') applicationId : number,
        @Arg('reason') reason : string
    ){
        let application = await ctx.prisma.seatApplication.findUnique({
            where :  {
                applicationId : applicationId
            }
        })
        if(application.status != 'PENDING'){
            throw new Error("Invalid state of application");
        }

        let result = await ctx.prisma.$transaction([
            ctx.prisma.seatApplication.update({
                where : {
                    applicationId : application.applicationId
                },
                data : {
                    status : 'REVISE'
                }
            }),
            ctx.prisma.revision.create({
                data : {
                    applicationId : application.applicationId,
                    reason : reason
                }
            }),
            ctx.prisma.notification.create({
                data : {
                    text : "Your application needs to be revised",
                    applicationId : application.applicationId,
                    studentId : application.studentId
                }
            })
        ])

        return result[1];
    }
}