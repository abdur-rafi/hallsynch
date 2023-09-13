import {Arg, Authorized, Ctx, Query} from "type-graphql";
import {params, roles, sortVals} from "../../../utility";
import {
    MessApplicationsWithCount,
    MessManager,
    MessManagerApplication, MessManagerApplicationCall, MessManagerCallWithAppsOfResident,
    SearchInput,
    SortInput
} from "../../../graphql-schema";
import {Context} from "../../../interface";
import {Prisma} from "@prisma/client";

export class MessManagerQueryResolvers {

    @Authorized([roles.PROVOST])
    @Query(() => MessApplicationsWithCount)
    async messManagerApplications(
        @Ctx() ctx: Context,
        @Arg('page') page: number,
        @Arg('sort', {nullable: true}) sort?: SortInput,
        @Arg('search', {nullable: true}) search?: SearchInput
    ) {
        let ands = [];
        if (search && search.searchBy && search.searchBy.trim().length > 0) {
            ands.push({
                OR: [
                    {
                        student: {
                            name: {
                                contains: search.searchBy as string
                            }
                        }
                    },
                    {
                        student: {
                            student9DigitId: {
                                contains: search.searchBy as string
                            }
                        }
                    }
                ]
            })
        }

        let order: Prisma.MessManagerApplicationOrderByWithRelationInput = {};
        if (sort.orderBy && sort.order) {
            if (sort.orderBy == 'Batch') {
                order = {
                    residency: {
                        student: {
                            batch: {
                                year: (sort.order == sortVals.oldest) ? 'asc' : 'desc'
                            }
                        }
                    }
                }
            } else {
                order = {
                    appliedAt: sort.order == sortVals.oldest ? 'asc' : 'desc'
                }
            }
        }

        let res = await ctx.prisma.$transaction([
            ctx.prisma.messManagerApplication.count({
                where: {
                    AND: ands
                }
            }),
            ctx.prisma.messManagerApplication.findMany({
                take: params.messApplicationPerPageCount,
                skip: (page - 1) * params.messApplicationPerPageCount,
                where: {
                    AND: ands
                },
                orderBy: order,
            })
        ])

        return {
            count: res[0],
            applications: res[1]
        }
    }

    @Authorized([roles.PROVOST])
    @Query(() => MessManagerApplication)
    async messManagerApplicationDetails(
        @Ctx() ctx: Context,
        @Arg('applicationId') applicationId: number
    ) {
        return await ctx.prisma.messManagerApplication.findFirst({
            where: {
                applicationId: applicationId
            }
        });
    }

    @Authorized([roles.PROVOST] || [roles.STUDENT_MESS_MANAGER])
    @Query(() => [MessManager])
    async messManagingExperiences(
        @Ctx() ctx: Context
    ) {
        return await ctx.prisma.messManager.findMany({
            where: {
                residency: {
                    student: {
                        studentId: ctx.identity.studentId
                    }
                }
            },
            orderBy: {
                call: {
                    to: 'asc'
                }
            }
        });
    }

    @Query(() => [MessManager])
    async assingedMessManagers(
        @Ctx() ctx: Context
    ) {
        return await ctx.prisma.messManager.findMany({
            where: {
                call: {
                    to: {
                        gte: new Date()
                    }
                }
            },
            orderBy: {
                call: {
                    from: 'asc'
                }
            }
        })
    }

    @Query(() => String)
    async messManagerAssignedTill(
        @Ctx() ctx: Context
    ) {
        let res = await ctx.prisma.messManager.findFirst({
            orderBy: {
                call: {
                    to: 'desc'
                }
            },
            include: {
                call: true
            }
        })
        return res.call.to.toString();
    }


    @Query(() => [MessManagerApplicationCall])
    async prevCalls(
        @Ctx() ctx: Context
    ) {
        return await ctx.prisma.messManagerApplicationCall.findMany({
            where: {
                to: {
                    gte: new Date()
                }
            }
        })
    }

    @Query(() => String)
    async callUntil(
        @Ctx() ctx: Context
    ) {
        let res = await ctx.prisma.messManagerApplicationCall.findFirst({
            orderBy: {
                to: 'desc'
            }
        })
        return res.to.toString();
    }

    @Query(() => [MessManagerCallWithAppsOfResident])
    async prevCallsWithAppOfResident(
        @Ctx() ctx: Context
    ) {
        let apps = await ctx.prisma.messManagerApplicationCall.findMany({
            where: {
                to: {
                    gte: new Date()
                }
            },
            orderBy: {
                to: 'asc'
            },
            include: {
                MessManagerApplication: {
                    where: {
                        residency: {
                            studentId: ctx.identity.studentId
                        }
                    }
                }
            }
        })
        console.log(apps);
        return apps.map(a => ({
            call: a,
            application: a.MessManagerApplication[0] ?? null
        }))
    }

}