import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {Context} from "../interface";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
    CupCount,
    NewApplication,
    Residency,
    Revision,
    SeatChangeApplication,
    SeatApplication,
    TempApplication,
    TempResidency,
    UserWithToken,
    Vote,
    IntArray,
    PreferenceInput, Preference, OptedOut, Announcement
} from "../graphql-schema";
import {roles} from "../utility";
import {ItemType, MealTime} from "@prisma/client";

export class mutationResolver{
    
    @Mutation(returns => UserWithToken)
    async login(
        @Ctx() ctx : Context,
        @Arg('id') id : string,
        @Arg('password') password : string
    ){
        // console.log(id);
        let student = await ctx.prisma.student.findUnique({
            where : {student9DigitId : id}
        })
        // console.log(student)
        let authority;
        if(!student){
            authority = await ctx.prisma.authority.findUnique({
                where : {email : id}
            })
            if(!authority)
                throw new Error("No User Found");

        }
        let b = await bcrypt.compare(password, (student??authority).password)
        if(!b){
            throw new Error("Invalid password");
        }

        let payload = {};
        let messManager;
        if(student){
             messManager = await ctx.prisma.messManager.findFirst({
                where : {
                    residency : {
                        student : {
                            studentId : student.studentId
                        }
                    },
                    assingedAt : {
                        lte : new Date(),
                        gt : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
                    }
                    // from : {
                    //     lte : new Date()
                    // },
                    // to : {
                    //     gt : new Date()
                    // }
                }
            })

            payload = {
                studentId : student.studentId,
                messManagerId : messManager?.messManagerId
            }
        }
        else{
            payload = {
                authorityId : authority.authorityId
            }
        }

        // console.log("hello ", messManager?.messManagerId)
        // console.log(payload)

        let token = jwt.sign(payload, process.env.JWTSECRET!)
        // console.log(token)
        return {
            student : student,
            authority : authority,
            messManager: messManager,
            token : token
        }

    }

    @Authorized(roles.STUDENT_ATTACHED)
    @Mutation(returns => NewApplication)
    async newSeatApplication(
        @Ctx() ctx : Context,
        @Arg('q1') q1 : boolean,
        @Arg('q2') q2 : boolean,
        @Arg('attachedFileIds') attachedFileIds : IntArray
    ){

        let pendingApplication = await ctx.prisma.newApplication.findFirst({
            where : {
                application : {
                    OR : [
                        {status : "PENDING"},
                        {status : "REVISE"}
                    ],
                    studentId : ctx.identity.studentId
                }
            }
        })
        // if(attachedFileIds.array.length > 5){
            
        // }

        if( pendingApplication ){
            throw new Error("One application still pending");
        }

        let verifyFile = await ctx.prisma.uploadedFile.findMany({
            where : {
                studentId : ctx.identity.studentId,
                uploadedFileId : {
                    in : attachedFileIds.array
                }
            }
        })
        if(verifyFile.length != attachedFileIds.array.length){
            throw new Error("Not authorized");
        }

        let application = await ctx.prisma.newApplication.create({
            data : {
                application : {
                    create : {
                        createdAt : new Date(),
                        lastUpdate : new Date(),
                        status : 'PENDING',
                        studentId : ctx.identity.studentId,
                        attachedFiles : {
                            createMany : {
                                data : attachedFileIds.array.map(v => ({
                                    uploadedFileId : v
                                }))
                            }
                        }
                    }
                },
                questionnaire : {
                    create : {
                        q1 : q1,
                        q2 : q2
                    }
                }
                
            },
            include : {
                application : true,
                questionnaire : true
            }
        })

        return application
    }


    @Authorized(roles.STUDENT_ATTACHED)
    @Mutation(returns => TempApplication)
    async tempSeatApplication(
        @Ctx() ctx : Context,
        @Arg('q1') q1 : boolean,
        @Arg('q2') q2 : boolean,
        @Arg('prefSeatId') prefSeatId : number,
        @Arg('days') days : number,
        @Arg('from') from : string
    ){

        let pendingApplication = await ctx.prisma.tempApplication.findFirst({
            where : {
                AND : [
                    {
                        applicaiton : {
                            OR : [
                                {status : "PENDING"},
                                {status : "REVISE"}
                            ],
                            studentId : ctx.identity.studentId
                        }
                    }
                ]
            }
        })

        if( pendingApplication ){
            throw new Error("One application still pending");
        }
        
        

        let application = await ctx.prisma.tempApplication.create({
            data : {
                applicaiton : {
                    create : {
                        createdAt : new Date(),
                        lastUpdate : new Date(),
                        status : 'PENDING',
                        studentId : ctx.identity.studentId
                    }
                },
                questionnaire : {
                    create : {

                    }
                },
                prefSeat : {
                    connect : {
                        seatId : prefSeatId
                    }
                },
                days : days,
                from : new Date(from)
            }
        })

        return application
    }

    
    // @Authorized(roles.STUDENT_RESIDENT) // adding this is causing the server to not respond to reqs. why????
    @Mutation(returns => SeatChangeApplication)
    async seatChangeApplication(
        @Ctx() ctx : Context,
        @Arg('seatId') seatId : number,
        @Arg('reason') reason : string
    ){
        console.log("in room change application\n");
        let pendingApplication = await ctx.prisma.seatChangeApplication.findFirst({
            where : {
                application : {
                    OR : [
                        {status : "PENDING"},
                        {status : "REVISE"}
                    ],
                    studentId : ctx.identity.studentId
                }
            }
        })



        if( pendingApplication ){
            throw new Error("One application still pending");
        }

        // let roomMembers = await ctx.prisma.residency.findMany({
        //     where : {
        //         roomId : roomId
        //     }
        // });
        let seat = await ctx.prisma.seat.findUnique({
            where : {
                seatId : seatId
            }
        })
        let residency = await ctx.prisma.residency.findFirst({
            where : {
                seatId : seatId
            }
        })
        if(residency){
            throw new Error("Seat is not empty\n");
        }
        let roomMembers = await ctx.prisma.residency.findMany({
            where : {
                seat : {
                    roomId : seat.roomId
                }
            }
        })


        let application = await ctx.prisma.seatChangeApplication.create({
            data : {
                application : {
                    create : {
                        createdAt : new Date(),
                        lastUpdate : new Date(),
                        status : 'PENDING',
                        studentId : ctx.identity.studentId
                    }
                },
                toSeat : {
                    connect : {
                        seatId : seatId
                    }
                },
                reason : reason
            }
        })

        console.log(roomMembers);

        await ctx.prisma.$transaction(
            roomMembers.map(m =>(
                ctx.prisma.vote.create({
                    data : {
                        status : "NOT_VOTED",
                        student : {
                            connect : {
                                studentId : m.studentId
                            }
                        },
                        reason : '',
                        lastUpdated : new Date(),
                        notification : {
                            create : {
                                text : "Request to move to a seat in your room",
                                studentId : m.studentId
                            }
                        },
                        seatChangeApplication : {
                            connect : {
                                seatChangeApplicationId : application.seatChangeApplicationId
                            }
                        }
                    }
                })
            ))
        )

        return application
    }

    @Authorized(roles.STUDENT)
    @Mutation(returns => Vote)
    async vote(
        @Ctx() ctx : Context,
        @Arg('voteId') voteId : number,
        @Arg('vote') vote : 'YES' | 'NO',
        @Arg('reason') reason : string,
        
    ){
        return await ctx.prisma.vote.update({
            where : {
                voteId : voteId
            },
            data : {
                lastUpdated : new Date(),
                status : vote,
                reason : reason
            }
        })
    }


    /* Mess Management Module starts */

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

    /* Mess Management Ends */

    
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
            })
        ])

        return result[1];        
    }
    
}