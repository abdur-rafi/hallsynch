import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {roles} from "../../../utility";
import {Item, MealPlan, MealPlanInput, OptedOut, Preference, PreferenceInput} from "../../../graphql-schema";
import {Context} from "../../../interface";
import {ItemType, MealTime} from "@prisma/client";

export class MealMutationResolvers {

    @Authorized(roles.STUDENT_RESIDENT)
    @Mutation(() => [Preference])
    async addPreferences(
        @Ctx() ctx: Context,
        @Arg('mealPlanId') mealPlanId: number,
        @Arg('preferences') preferences: PreferenceInput
    ) {
        let mealPlan = await ctx.prisma.mealPlan.findUnique({
            where: {
                mealPlanId: mealPlanId
            }
        });

        if (!mealPlan) {
            throw new Error("Meal Plan not found\n");
        }

        let resident = await ctx.prisma.residency.findFirst({
            where: {
                studentId: ctx.identity.studentId
            }
        })

        if (!resident) {
            throw new Error("Resident not found\n");
        }

        let optedOut = await ctx.prisma.optedOut.findFirst({
            where: {
                mealPlanId: mealPlanId,
                residencyId: resident.residencyId
            }
        });

        if (optedOut) {
            throw new Error("Already opted out. No preference can be given\n");
        }

        let preference = await ctx.prisma.preference.findFirst({
            where: {
                mealPlanId: mealPlanId,
                residencyId: resident.residencyId
            }
        });

        if (preference) {
            throw new Error("Preference already exists for this student\n");
        }

        preferences.preferences.map(async p => {
            await ctx.prisma.preference.create({
                data: {
                    mealPlanId: mealPlanId,
                    residencyId: resident.residencyId,
                    ...p
                }
            })
        })

        return await ctx.prisma.preference.findMany({
            where: {
                mealPlanId: mealPlanId,
                residencyId: resident.residencyId
            }
        });
    }

    @Authorized(roles.STUDENT_RESIDENT)
    @Mutation(() => OptedOut)
    async optOut(
        @Ctx() ctx: Context,
        @Arg('mealPlanId') mealPlanId: number
    ) {
        let mealPlan = await ctx.prisma.mealPlan.findUnique({
            where: {
                mealPlanId: mealPlanId
            }
        });

        if (!mealPlan) {
            throw new Error("Meal Plan not found\n");
        }

        let resident = await ctx.prisma.residency.findFirst({
            where: {
                studentId: ctx.identity.studentId
            }
        })

        if (!resident) {
            throw new Error("Resident not found\n");
        }

        let optedOut = await ctx.prisma.optedOut.findFirst({
            where: {
                mealPlanId: mealPlanId,
                residencyId: resident.residencyId
            }
        });

        if (optedOut) {
            throw new Error("Already opted out\n");
        }

        let newOptedOut = await ctx.prisma.optedOut.create({
            data: {
                mealPlanId: mealPlanId,
                residencyId: resident.residencyId
            }
        })

        // clear preferences for this student for this meal plan
        await ctx.prisma.preference.deleteMany({
            where: {
                mealPlanId: mealPlanId,
                residencyId: resident.residencyId
            }
        })

        return newOptedOut;
    }

    // @Authorized(roles.STUDENT_MESS_MANAGER)
    @Mutation(() => Item)
    async addNewItem(
        @Ctx() ctx: Context,
        @Arg('name') name: string,
        @Arg('type') type: string,
        @Arg('fileId') fileId: number
    ) {

        const existingItem = await ctx.prisma.item.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        });

        if (existingItem) {
            throw new Error("This Item already exists\n");
        }

        let itemType: ItemType;
        if (type.toLowerCase() == 'rice') itemType = ItemType.RICE;
        else if (type.toLowerCase() == 'veg') itemType = ItemType.VEG;
        else itemType = ItemType.NON_VEG;

        let photoFile = null;
        console.log(name,type, fileId);
        if(fileId != -1) {
            photoFile = await ctx.prisma.photo.create({
                data : {
                    file : {
                        connect : {
                            uploadedFileId : fileId
                        }
                    }
                }
            })
        }

        let newItem = await ctx.prisma.item.create({
            data: {
                name: name,
                type: itemType,
                photoId: photoFile?.photoId ?? null
            },
            include: {
                photo: true
            }
        });

        return newItem;
    }

    // @Authorized(roles.STUDENT_MESS_MANAGER)
    @Mutation(() => MealPlan)
    async addNewMealPlan(
        @Ctx() ctx: Context,
        @Arg('date') date: string,
        @Arg('mealTime') mealtime: string,
        @Arg('items') items: MealPlanInput,
        @Arg('mealId', {nullable : true}) mealId? : number
    ) {

        let mealTime: MealTime;
        if (mealtime.toLowerCase() == 'lunch') mealTime = MealTime.LUNCH;
        else mealTime = MealTime.DINNER;

        let existingMealPlan = await ctx.prisma.mealPlan.findFirst({
            where: {
                day: new Date(date),
                mealTime: mealTime
            }
        });

        if (existingMealPlan) {
            throw new Error("Meal plan for this time already exists\n");
        }

        let mealConnOrCreate : any = {
            create: {
                createdAt: new Date(date),
                items : {
                    connect : items.items.map(item => {
                        return {
                            itemId : item.itemId
                        }
                    })
                }
            }
        }

        if(mealId){
            mealConnOrCreate = {
                connect : {
                    mealId : mealId
                },
                create: {
                    createdAt: new Date(date),
                    items : {
                        connect : items.items.map(item => {
                            return {
                                itemId : item.itemId
                            }
                        })
                    }
                }
            }
        }

        let newMealPlan = await ctx.prisma.mealPlan.create({
            data: {
                day: new Date(date),
                mealTime: mealTime,
                meal: mealConnOrCreate,
                messManager: {
                    connect: {
                        messManagerId: ctx.identity.messManagerId
                    }
                }
            },
            include: {
                meal: true
            }
        });

        items.items.map(async item => {
            await ctx.prisma.cupCount.create({
                data: {
                    cupcount: item.cupCount,
                    mealPlan: {
                        connect: {
                            mealPlanId: newMealPlan.mealPlanId
                        }
                    },
                    item: {
                        connect: {
                            itemId: item.itemId
                        }
                    }
                },
                include: {
                    item: true,
                    mealPlan: true
                }
            });
        });

        return newMealPlan;
    }

    @Authorized(roles.STUDENT_MESS_MANAGER)
    @Mutation(() => MealPlan)
    async addOldMealPlan(
        @Ctx() ctx: Context,
        @Arg('date') date: string,
        @Arg('mealTime') mealtime: string,
        @Arg('oldMealPlanId') oldMealPlanId: number
    ) {

        let mealTime: MealTime;
        if (mealtime.toLowerCase() == 'lunch') mealTime = MealTime.LUNCH;
        else mealTime = MealTime.DINNER;

        let oldMealPlan = await ctx.prisma.mealPlan.findFirst({
            where: {
                mealPlanId: oldMealPlanId
            }
        });

        if (!oldMealPlan) {
            throw new Error("No such meal plan found");
        }

        let existingMealPlan = await ctx.prisma.mealPlan.findFirst({
            where: {
                day: new Date(date),
                mealTime: mealTime
            }
        });

        if (existingMealPlan) {
            throw new Error("Meal plan for this time already exists\n");
        }

        let oldMealPlanItems = await ctx.prisma.cupCount.findMany({
            where: {
                mealPlan: {
                    mealPlanId: oldMealPlanId
                }
            }
        });

        let newMealPlan = await ctx.prisma.mealPlan.create({
            data: {
                day: new Date(date),
                mealTime: mealTime,
                meal: {
                    create: {
                        createdAt: new Date(date),
                    }
                },
                messManager: {
                    connect: {
                        messManagerId: ctx.identity.messManagerId
                    }
                }
            },
            include: {
                meal: true
            }
        });

        oldMealPlanItems.map(async item => {
            await ctx.prisma.cupCount.create({
                data: {
                    cupcount: item.cupcount,
                    mealPlan: {
                        connect: {
                            mealPlanId: newMealPlan.mealPlanId
                        }
                    },
                    item: {
                        connect: {
                            itemId: item.itemId
                        }
                    }
                },
                include: {
                    item: true,
                    mealPlan: true
                }
            });
        });

        return newMealPlan;
    }
}