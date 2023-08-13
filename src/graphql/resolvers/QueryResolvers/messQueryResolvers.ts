import {Arg, Authorized, Ctx, Query} from "type-graphql";
import {getMealTime, roles} from "../../utility";
import {
    Announcement, FeedbackWithRating,
    Item,
    MealPlan,
    MealPlanWithCount, MealPreferenceStats,
    OptedOutCount,
    ResidencyWithParticipationCount
} from "../../graphql-schema";
import {Context} from "../../interface";
import {MealTime} from "@prisma/client";


export class messQueryResolver {

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => MealPlan)
    async getMealPlan(
        @Ctx() ctx: Context,
        @Arg('date') date : string,
        @Arg('mealTime') mealtime : string
    ) {

        let mealTime : MealTime;
        if(mealtime.toLowerCase() == 'lunch') mealTime = MealTime.LUNCH;
        else mealTime = MealTime.DINNER;

        let res = await ctx.prisma.mealPlan.findFirst({
            where: {
                day: new Date(date),
                mealTime: mealTime
            }
        });

        if(!res) throw new Error("Meal plan not found");
        return res;
    }

    // get multiple meal plans for student view
    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [MealPlan])
    async getMealPlans(
        @Ctx() ctx: Context,
        @Arg('from') from : string,
        @Arg('to') to : string
    ) {
        return await ctx.prisma.mealPlan.findMany({
            where: {
                day: {
                    gte: new Date(from),
                    lte: new Date(to)
                }
            }
        });
    }

    @Authorized([roles.STUDENT_RESIDENT])
    @Query(returns => [Item])
    async getOldItems(
        @Ctx() ctx: Context,
    ) {
        return await ctx.prisma.item.findMany();
    }

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

    @Authorized([roles.PROVOST])
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


    @Authorized([roles.PROVOST])
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



    @Authorized([roles.STUDENT_MESS_MANAGER])
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

    @Authorized([roles.STUDENT_MESS_MANAGER])
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



    @Authorized([roles.STUDENT_MESS_MANAGER])
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
}