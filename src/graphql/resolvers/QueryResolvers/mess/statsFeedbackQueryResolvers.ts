import {Arg, Authorized, Ctx, Query} from "type-graphql";
import {
    Feedback,
    FeedbackWithRating,
    MealPlanWithCount,
    MealPreferenceStats,
    OptedOutCount,
    ResidencyWithParticipationCount
} from "../../../graphql-schema";
import {Context} from "../../../interface";
import {getMealTime, roles} from "../../../utility";
import {Prisma} from "@prisma/client";


export class StatsFeedbackQueryResolvers {

    // @Authorized([roles.PROVOST])
    @Query(returns => [MealPlanWithCount])
    async participants(
        @Ctx() ctx : Context,
        @Arg('from') from : string,
        @Arg('mealTime') mealTime : string
    ){

        let res = await ctx.prisma.mealPlan.findMany({
            where : {
                day : {
                    gte : new Date(from)
                },
                mealTime : getMealTime(mealTime)
            },
            include : {
                _count : {
                    select : {
                        Participation : true
                    }
                }
            },
            orderBy : {
                day : 'asc'
            }
        })
        return res.map(r => ({
            mealPlan : r,
            _count : r._count.Participation
        }));

    }


    // @Authorized([roles.PROVOST])
    @Query(returns => [ResidencyWithParticipationCount])
    async absentees(
        @Ctx() ctx : Context,
        @Arg('from') from : string,
        @Arg('take') take : number
    ){

        let res = await ctx.prisma.residency.findMany({
            include : {
                _count : {
                    select : {
                        Participation : {
                            where : {
                                mealPlan : {
                                    day : {
                                        gte : new Date(from)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        let mealCount = await ctx.prisma.mealPlan.count({
            where : {
                day : {
                    gte : new Date(from)
                }
            }
        })


        let s = res.map(r =>({
            residency : r,
            _count : mealCount - r._count.Participation
        }))
        s.sort((a, b)=> b._count - a._count)
        // console.log(res);

        return s.slice(0, take);
    }



    // @Authorized([roles.STUDENT_MESS_MANAGER])
    @Query(returns => OptedOutCount)
    async optedOutStats(
        @Ctx() ctx : Context,
        @Arg('date') date : string,
        @Arg('mealTime') mealTime : string
    ){

        let optedOutCount = await ctx.prisma.optedOut.count({
            where : {
                mealPlan : {
                    day : new Date(date),
                    mealTime : getMealTime(mealTime)
                }
            }
        })
        let totalResidents = await ctx.prisma.residency.count();

        return {
            optedOut : optedOutCount,
            total : totalResidents
        }
    }

    // @Authorized([roles.STUDENT_MESS_MANAGER])
    @Query(returns => [MealPreferenceStats])
    async mealPreferenceStats(
        @Ctx() ctx : Context,
        @Arg('date') date : string,
        @Arg('mealTime') mealTime : string
    ){

        let preferences = await ctx.prisma.preference.groupBy({
            where : {
                mealPlan : {
                    day : new Date(date),
                    mealTime : getMealTime(mealTime)
                }
            },
            by : ['order', 'itemId'],
            _count : {
                residencyId : true
            }
        })

        let items = await ctx.prisma.item.findMany({
            where : {
                itemId : {
                    in : preferences.map(p => p.itemId)
                }
            }
        })

        // console.log(items);
        // console.log(preferences);

        return preferences.map(p =>({
            count : p._count.residencyId,
            order : p.order,
            item : items.filter(i => i.itemId == p.itemId)[0]
        }))

        console.log(preferences)
    }

    // @Authorized([roles.STUDENT_MESS_MANAGER])
    @Query(returns => [FeedbackWithRating])
    async ratings(
        @Ctx() ctx : Context,
        @Arg('date') date : string
    ){
        let res = await ctx.prisma.rating.groupBy({
            by : ['type', 'feedbackId'],
            where : {
                feedback : {
                    startMealPlan : {
                        day : {
                            gte : new Date(date)
                        }
                    }
                }
            },
            _avg : {
                rating : true
            },
            orderBy : {
                feedbackId : 'asc'
            }
        })

        let feedbacks = await ctx.prisma.feedback.findMany({
            where : {
                feedbackId : {
                    in : res.map(r => r.feedbackId)
                }
            }
        })

        return res.map(r => ({
            avg : r._avg.rating,
            type : r.type,
            feedback : feedbacks.filter(f => f.feedbackId == r.feedbackId)[0]
        }))



    }
    @Authorized(roles.STUDENT_RESIDENT)
    @Query(returns => [Feedback])
    async pendingFeedbacks(
        @Ctx() ctx : Context
    ){
        console.log( "identity in fb", ctx.identity);
        let lastFeedBack = await ctx.prisma.feedBackGiven.findFirst({
            where : {
                residency : {
                    studentId : ctx.identity.studentId
                }
            },
            orderBy : {
                feedBack : {
                    startDate : 'desc'
                }
            },
            include : {
                feedBack : true
            }
        })
        // console.log(lastFeedBack)
        let where : Prisma.FeedbackWhereInput = {};
        if(lastFeedBack){
            where = {
                feedbackId : {
                    gt : lastFeedBack.feedBackId
                }
            }
        }
        where = {
            ... where,
            startDate : {
                lte : new Date()
            }
        }
        let res = await ctx.prisma.feedback.findMany({
            where : where
        })
        console.log("res",res);
        return res;
    }
}