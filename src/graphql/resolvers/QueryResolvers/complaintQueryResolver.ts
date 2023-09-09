import {Arg, Authorized, Ctx, Query} from "type-graphql";
// import {roles} from "../../../utility";
// import {Announcement} from "../../../graphql-schema";
// import {Context} from "../../../interface";
import { roles } from "../../utility";
import { Context } from "../../interface";
import { Complaint, FilterInput, complaintTypeFilerInput , SearchInput, SortInput } from "../../graphql-schema";
import { ComplaintType } from "@prisma/client";
import { Prisma } from "@prisma/client";



export class ComplaintQueryResolvers {

    //@Authorized([roles.STUDENT_RESIDENT])
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


    //@Authorized([roles.PROVOST])
    @Query(returns => [Complaint])
    async getComplaints2(
        @Ctx() ctx : Context,
        @Arg('page') page : number,
        @Arg('filters', {nullable: true}) filters? : complaintTypeFilerInput,
        @Arg('sort', {nullable: true}) sort? : SortInput,
        @Arg('search', {nullable: true}) search? : SearchInput,
    ) {
        let ands : Prisma.ComplaintWhereInput[] = [];
        if(filters) {
            if(filters.type.length) {
                ands.push({
                    type: {
                        in: filters.type as ComplaintType[]
                    }
                });
            }
        }
        if(search && search.searchBy && search.searchBy.trim().length > 0) {
            ands.push({
                OR: [
                    {
                        student : {
                            student9DigitId: {
                                contains: search.searchBy as string
                            }
                        }
                    }
                ]
            });
        }
        let order : Prisma.ComplaintOrderByWithRelationInput = {}
        if(sort) {
            if(sort.orderBy && sort.order) {
                if(sort.orderBy === 'createdAt') {
                    order = {
                        createdAt: (sort.order === 'asc') ? 'asc' : 'desc'
                    }
                }
            }
        }        

        let result = await ctx.prisma.$transaction([
            ctx.prisma.complaint.findMany({
                where: {
                    AND: ands
                },
                orderBy: order,
                skip: (page - 1) * 10,
                take: 10
            })
        ]);
        return result[0];
    }




    //@Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => Complaint)
    async getComplaint(
        @Ctx() ctx: Context,
        @Arg('complaintId') complaintId: number
    ) {
        return await ctx.prisma.complaint.findFirst({
            where: {
                complaintId: complaintId
            }
        });
    }

    //@Authorized([roles.PROVOST])
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

    //@Authorized([roles.PROVOST])
    @Query(returns => [Complaint])
    async getComplaintsByType(
        @Ctx() ctx: Context,
        @Arg('type') type: String
    ) {
        let complaintType: ComplaintType;
        if (type.toLowerCase().includes("resource")) {
            complaintType = ComplaintType.RESOURCE;
        } else if (type.toLowerCase().includes("stuff")) {
            complaintType = ComplaintType.STUFF;
        } else if (type.toLowerCase().includes("student")) {
            complaintType = ComplaintType.STUDENT;
        }

        return await ctx.prisma.complaint.findMany({
            where: {
                type: complaintType
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    //@Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [Complaint])
    async getComplaintsByTypeAndStudent(
        @Ctx() ctx: Context,
        @Arg('type') type: String,
        @Arg('studentId') studentId: number
    ) {
        let complaintType: ComplaintType;
        if (type.includes("resource")) {
            complaintType = ComplaintType.RESOURCE;
        } else if (type.includes("stuff")) {
            complaintType = ComplaintType.STUFF;
        } else if (type.includes("student")) {
            complaintType = ComplaintType.STUDENT;
        }
        return await ctx.prisma.complaint.findMany({
            where: {
                type: complaintType,
                studentId: studentId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    // query for complaints from a specific date
    //@Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [Complaint])
    async getComplaintsFromDate(
        @Ctx() ctx: Context,
        @Arg('date') date : string,
    ) {
        return await ctx.prisma.complaint.findMany({
            where: {
                createdAt: {
                    gte: new Date(date)
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }


}