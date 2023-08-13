import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {roles} from "../../utility";
import {Announcement, CupCount, OptedOut, Preference, PreferenceInput} from "../../graphql-schema";
import {Context} from "../../interface";
import {ItemType, MealTime} from "@prisma/client";


export class messMutationResolver {

    @Authorized(roles.STUDENT_RESIDENT)
    @Mutation(returns => [Preference])
    async addPreferences(
        @Ctx() ctx : Context,
        @Arg('mealPlanId') mealPlanId : number,
        @Arg('preferences') preferences : PreferenceInput
    ) {
        let mealPlan = await ctx.prisma.mealPlan.findUnique({
            where : {
                mealPlanId : mealPlanId
            }
        });

        if(!mealPlan){
            throw new Error("Meal Plan not found\n");
        }

        let resident = await ctx.prisma.residency.findFirst({
            where : {
                studentId : ctx.identity.studentId
            }
        })

        if(!resident){
            throw new Error("Resident not found\n");
        }

        let optedOut = await ctx.prisma.optedOut.findFirst({
            where : {
                mealPlanId : mealPlanId,
                residencyId: resident.residencyId
            }
        });

        if(optedOut){
            throw new Error("Already opted out. No preference can be given\n");
        }

        let preference = await ctx.prisma.preference.findFirst({
            where : {
                mealPlanId : mealPlanId,
                residencyId: resident.residencyId
            }
        });

        if(preference){
            throw new Error("Preference already exists for this student\n");
        }

        preferences.preferences.map(async p => {
            await ctx.prisma.preference.create({
                data : {
                    mealPlanId : mealPlanId,
                    residencyId : resident.residencyId,
                    ...p
                }
            })
        })

        return await ctx.prisma.preference.findMany({
            where : {
                mealPlanId : mealPlanId,
                residencyId: resident.residencyId
            }
        });
    }

    @Authorized(roles.STUDENT_RESIDENT)
    @Mutation(returns => OptedOut)
    async optOut(
        @Ctx() ctx : Context,
        @Arg('mealPlanId') mealPlanId : number
    ){
        let mealPlan = await ctx.prisma.mealPlan.findUnique({
            where : {
                mealPlanId : mealPlanId
            }
        });

        if(!mealPlan){
            throw new Error("Meal Plan not found\n");
        }

        let resident = await ctx.prisma.residency.findFirst({
            where : {
                studentId : ctx.identity.studentId
            }
        })

        if(!resident){
            throw new Error("Resident not found\n");
        }

        let optedOut = await ctx.prisma.optedOut.findFirst({
            where : {
                mealPlanId : mealPlanId,
                residencyId: resident.residencyId
            }
        });

        if(optedOut){
            throw new Error("Already opted out\n");
        }

        let newOptedOut = await ctx.prisma.optedOut.create({
            data : {
                mealPlanId : mealPlanId,
                residencyId : resident.residencyId
            }
        })

        // clear preferences for this student for this meal plan
        await ctx.prisma.preference.deleteMany({
            where : {
                mealPlanId : mealPlanId,
                residencyId: resident.residencyId
            }
        })

        return newOptedOut;
    }

    @Authorized(roles.STUDENT_MESS_MANAGER)
    @Mutation(returns => CupCount)
    async addNewMealItem(
        @Ctx() ctx : Context,
        @Arg('name') name : string,
        @Arg('type') type : string,
        @Arg('cupCount') cupCount : number,
        @Arg('photoId') photoId : number,
        @Arg('date') date : string,
        @Arg('mealTime') mealtime : string,
    ){

        const existingItem = await ctx.prisma.item.findFirst({
            where : {
                name : {
                    equals : name,
                    mode : 'insensitive'
                }
            }
        });

        if(existingItem){
            throw new Error("This Item already exists\n");
        }

        let itemType : ItemType;
        if(type.toLowerCase() == 'rice') itemType = ItemType.RICE;
        else if(type.toLowerCase() == 'veg') itemType = ItemType.VEG;
        else itemType = ItemType.NON_VEG;

        let mealTime : MealTime;
        if(mealtime.toLowerCase() == 'lunch') mealTime = MealTime.LUNCH;
        else mealTime = MealTime.DINNER;

        let photoFile = await ctx.prisma.photo.findFirst({
            where : {
                photoId : photoId
            }
        })

        let newItem = await ctx.prisma.item.create({
            data : {
                name : name,
                type : itemType,
                photoId : photoFile?.photoId
            },
            include : {
                photo : true
            }
        });

        let newMealPlan = await ctx.prisma.mealPlan.create({
            data : {
                day: new Date(date),
                mealTime : mealTime,
                meal : {
                    create : {
                        createdAt : new Date(date),
                    }
                },
                messManager : {
                    connect : {
                        messManagerId : ctx.identity.messManagerId
                    }
                }
            },
            include : {
                meal : true
            }
        });

        let newCupCount = await ctx.prisma.cupCount.create({
            data : {
                cupcount : cupCount,
                item : {
                    connect : {
                        itemId : newItem.itemId
                    }
                },
                mealPlan : {
                    connect : {
                        mealPlanId : newMealPlan.mealPlanId
                    }
                }
            },
            include : {
                item : true,
                mealPlan : true
            }
        });

        return newCupCount;
    }


    @Authorized(roles.STUDENT_MESS_MANAGER)
    @Mutation(returns => CupCount)
    async addOldMealItem(
        @Ctx() ctx : Context,
        @Arg('itemId') itemId : number,
        @Arg('cupCount') cupCount : number,
        @Arg('date') date : string,
        @Arg('mealTime') mealtime : string
    ){

        let mealTime : MealTime;
        if(mealtime.toLowerCase() == 'lunch') mealTime = MealTime.LUNCH;
        else mealTime = MealTime.DINNER;

        let item = await ctx.prisma.item.findFirst({
            where : {
                itemId : itemId
            }
        });

        if(!item){
            throw new Error("No such item found");
        }

        let cupCountExists = await ctx.prisma.cupCount.findFirst({
            where : {
                mealPlan : {
                    day : new Date(date),
                    mealTime : mealTime
                },
                item : {
                    itemId : itemId
                }
            }
        });

        if(cupCountExists){
            throw new Error("This item already exists for this meal");
        }

        let newCupCount = await ctx.prisma.cupCount.create({
            data : {
                cupcount : cupCount,
                mealPlan : {
                    create : {
                        day: new Date(date),
                        mealTime : mealTime,
                        meal : {
                            create : {
                                createdAt : new Date(date),
                            }
                        },
                        messManager : {
                            connect : {
                                messManagerId : ctx.identity.messManagerId
                            }
                        }
                    }
                },
                item : {
                    connect : {
                        itemId : item.itemId
                    }
                }
            },
            include : {
                item : true,
                mealPlan : true
            }
        });

        return newCupCount;
    }

    @Authorized(roles.STUDENT_MESS_MANAGER || roles.PROVOST)
    @Mutation(returns => Announcement)
    async addAnnouncement(
        @Ctx() ctx : Context,
        @Arg('title') title : string,
        @Arg('details') details : string
    ) {
        let authority = await ctx.prisma.authority.findFirst({
            where : {
                authorityId : ctx.identity.authorityId
            }
        });

        let messManager = await ctx.prisma.messManager.findFirst({
            where : {
                messManagerId : ctx.identity.messManagerId
            }
        });

        if(!authority && !messManager){
            throw new Error("Not authorized to make announcements");
        }

        let newAnnouncement = await ctx.prisma.announcement.create({
            data : {
                title : title,
                details : details,
                createdAt : new Date(),
                authorityId : authority?.authorityId ?? null,
                messManagerId : messManager?.messManagerId ?? null
            }
        });

        return newAnnouncement;
    }
}