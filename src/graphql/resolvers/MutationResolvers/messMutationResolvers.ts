import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {addDay, ratingTypes, roles} from "../../utility";
import {
    Announcement,
    CupCount, IntArray, MessManager,
    MessManagerApplication,
    MessManagerApplicationCall,
    OptedOut,
    Preference,
    PreferenceInput
} from "../../graphql-schema";
import {Context} from "../../interface";
import {ItemType, MealTime, RatingType} from "@prisma/client";


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
        @Arg('fileId') fileId : number,
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

        let photoFile = await ctx.prisma.photo.create({
            data : {
                uploadedFileId: fileId
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

        if(!ctx.identity.authorityId && !ctx.identity.messManagerId){
            throw new Error("Not authorized to make announcements");
        }

        let newAnnouncement = await ctx.prisma.announcement.create({
            data : {
                title : title,
                details : details,
                createdAt : new Date(),
                authorityId : ctx.identity.authorityId ?? null,
                messManagerId : ctx.identity.messManagerId ?? null
            }
        });

        return newAnnouncement;
    }

    @Authorized(roles.STUDENT_MESS_MANAGER || roles.PROVOST)
    @Mutation(returns => Announcement)
    async removeAnnouncement(
        @Ctx() ctx : Context,
        @Arg('announcementId') announcementId : number
    ) {
        let announcement = await ctx.prisma.announcement.findFirst({
            where: {
                announcementId: announcementId
            }
        });

        if(!announcement){
            throw new Error("No such announcement found");
        }

        let deleted = await ctx.prisma.announcement.delete({
            where: {
                announcementId: announcementId
            }
        });

        return deleted;
    }

    @Authorized(roles.STUDENT_RESIDENT)
    @Mutation(returns => MessManagerApplication)
    async applyMessManager(
        @Ctx() ctx : Context,
        @Arg('callId') callId : number
    ){
        

        let application = await ctx.prisma.messManagerApplication.findFirst({
            where : {
                residency : {
                    student : {
                        studentId : ctx.identity.studentId
                    }
                },
                callId : callId
            }
        });

        if(application) {
            throw new Error("Already applied for Mess Manager for this call");
        }

        // let existingMessManager = await ctx.prisma.messManager.findMany({
        //     where : {
        //         OR : [
        //             {
        //                 from : {
        //                     gte : new Date(preferredFrom),
        //                     lte : new Date(preferredTo)
        //                 }
        //             },
        //             {
        //                 to : {
        //                     gte : new Date(preferredFrom),
        //                     lte : new Date(preferredTo)
        //                 }
        //             }
        //         ]
        //     }
        // });

        // if(existingMessManager.length > 3){
        //     throw new Error("More than 3 Mess Managers already exist for this time period");
        // }


        let resident = await ctx.prisma.residency.findFirst({
            where : {
                studentId : ctx.identity.studentId
            }
        });

        // if(existingMessManager.filter(mm => mm.residencyId == resident.residencyId).length > 0){
        //     throw new Error("You are already a Mess Manager for this time period");
        // }

        let newApplication = await ctx.prisma.messManagerApplication.create({
            data : {
                residencyId: resident.residencyId,
                appliedAt : new Date(),
                callId : callId
            }
        });

        return newApplication;
    }

    @Authorized(roles.PROVOST)
    @Mutation(returns => MessManager)
    async approveMessManagerApplication(
        @Ctx() ctx : Context,
        @Arg('messManagerApplicationId') messManagerApplicationId : number
    ){
        let application = await ctx.prisma.messManagerApplication.findFirst({
            where : {
                applicationId : messManagerApplicationId
            },
            include : {
                call : true
            }
        });

        if(!application){
            throw new Error("No such application found");
        }

        if(application.status != 'PENDING'){
            throw new Error("Invalid state of application");
        }

        // if(new Date(from) > new Date(to)){
        //     throw new Error("Invalid date range");
        // }

        // if(new Date(from).getMonth() != new Date(application.preferredFrom).getMonth() ||
        //    new Date(to).getMonth() != new Date(application.preferredTo).getMonth()) {
        //     throw new Error("Application preferred month and approved month do not match");
        // }

        let result = await ctx.prisma.$transaction([
            ctx.prisma.messManager.create({
                data : {
                    from : application.call.from,
                    to : application.call.to, 
                    residencyId : application.residencyId,
                    assingedAt : new Date()
                }
            }),
            ctx.prisma.messManagerApplication.update({
                where : {
                    applicationId : messManagerApplicationId
                },
                data : {
                    status : 'ACCEPTED'
                }
            })
        ])

        return result[0];
    }

    @Authorized(roles.PROVOST)
    @Mutation(returns => MessManagerApplication)
    async rejectMessManagerApplication(
        @Ctx() ctx : Context,
        @Arg('messManagerApplicationId') messManagerApplicationId : number
    ){
        let application = await ctx.prisma.messManagerApplication.findFirst({
            where : {
                applicationId : messManagerApplicationId
            }
        });

        if(!application){
            throw new Error("No such application found");
        }

        if(application.status != 'PENDING'){
            throw new Error("Invalid state of application");
        }

        let result = await ctx.prisma.messManagerApplication.update({
            where : {
                applicationId : messManagerApplicationId
            },
            data : {
                status : 'REJECTED'
            }
        })

        return result;
    }

    @Authorized(roles.STUDENT_RESIDENT)
    @Mutation(returns => String)
    async postFeedback(
        @Ctx() ctx : Context,
        @Arg('ratings') ratings : IntArray,
        @Arg('comment', {
            nullable : true
        }) comment : string,
        @Arg('feedbackId') feedbackId : number
    ){
        let residency = await ctx.prisma.residency.findUnique({
            where : {
                studentId : ctx.identity.studentId
            }
        })
        await ctx.prisma.$transaction([
            ctx.prisma.rating.createMany({
                data : ratingTypes.map((r, i)=>({
                    feedbackId : feedbackId,
                    rating : ratings.array[i],
                    residencyId : residency.residencyId,
                    type : RatingType[r]
                }))
            }),
            ctx.prisma.feedBackGiven.create({
                data : {
                    comment : comment,
                    feedBackId : feedbackId,
                    residencyId : residency.residencyId
                }
            })
        ])
        return "success";
    }

    
    @Mutation(returns => MessManagerApplicationCall)
    async createCall(
        @Ctx() ctx : Context,
        @Arg('from') from : string,
        @Arg('to') to : string,
    ){
        let fixedUpto = await ctx.prisma.messManagerApplicationCall.findFirst({
            orderBy : {
                to : "desc"
            }
        })
        let fromDate = new Date(from);
        let fixedUptoDate = new Date().toDateString();
        if(fixedUpto){
            fixedUptoDate = fixedUpto.to.toDateString();
        }
        if(fromDate > addDay(fixedUptoDate)){
            throw new Error("Gap in Calls");
        }
        return await ctx.prisma.messManagerApplicationCall.create({
            data : {
                from : new Date(from),
                to : new Date(to),
                createdById : ctx.identity.authorityId
            }
        })
    }
}