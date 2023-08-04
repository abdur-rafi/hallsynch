import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {Context} from "../interface";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {CupCount, NewApplication, Residency, Revision, SeatChangeApplication, SeatApplication, TempApplication, TempResidency, UserWithToken, Vote, IntArray} from "../graphql-schema";
import {roles} from "../utility";
import {ItemType, MealTime} from "@prisma/client";
import { contains } from "class-validator";

export class mutationResolver{
    
    @Mutation(returns => UserWithToken)
    async login(
        @Ctx() ctx : Context,
        @Arg('id') id : string,
        @Arg('password') password : string
    ){
        // console.log(id);
        let student = await ctx.prisma.student.findUnique({where : {student9DigitId : id}})
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
        if(student){
            payload = {
                studentId : student.studentId
            }
        }
        else{
            payload = {
                authorityId : authority.authorityId
            }
        }

        let token = jwt.sign(payload, process.env.JWTSECRET!)
        // console.log(token)
        return {
            student : student,
            authority : authority,
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
                toRoom : {
                    connect : {
                        roomId : seatId
                    }
                },
                reason : reason,
                votes : {
                    createMany : {
                        data : roomMembers.map(r =>({
                            lastUpdated : new Date(),
                            reason : '',
                            status : 'NOT_VOTED',
                            studentId : r.studentId
                        }))
                    }
                }
            },
            include : {
                application : true
            }
        })

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

    


    @Authorized(roles.STUDENT_MESS_MANAGER)
    @Mutation(returns => CupCount)
    async addNewMealItem(
        @Ctx() ctx : Context,
        @Arg('name') name : string,
        @Arg('type') type : string,
        @Arg('cupCount') cupCount : number,
        @Arg('photoLocation') photoLocation : string = "",
        @Arg('date') date : string,
        @Arg('mealTime') mealtime : string
    ){

        let itemType : ItemType;
        if(type.toLowerCase() == 'rice') itemType = ItemType.RICE;
        else if(type.toLowerCase() == 'veg') itemType = ItemType.VEG;
        else itemType = ItemType.NON_VEG;

        let mealTime : MealTime;
        if(mealtime.toLowerCase() == 'lunch') mealTime = MealTime.LUNCH;
        else mealTime = MealTime.DINNER;


        let newItem = await ctx.prisma.item.create({
            data : {
                name : name,
                type : itemType,
                photo : {
                    create : {
                        filePath : photoLocation
                    }
                }
            },
            include : {
                photo : true
            }
        });

        let newMealPan = await ctx.prisma.mealPlan.create({
            data : {
                day: new Date(date),
                mealTime : mealTime,
                meal : {
                    create : {
                        createdAt : new Date(date),
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
                        mealPlanId : newMealPan.mealPlanId
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
        @Arg('name') name : string,
        @Arg('type') type : string,
        @Arg('cupCount') cupCount : number,
        @Arg('date') date : string,
        @Arg('mealTime') mealtime : string
    ){

        let itemType : ItemType;
        if(type.toLowerCase() == 'rice') itemType = ItemType.RICE;
        else if(type.toLowerCase() == 'veg') itemType = ItemType.VEG;
        else itemType = ItemType.NON_VEG;

        let mealTime : MealTime;
        if(mealtime.toLowerCase() == 'lunch') mealTime = MealTime.LUNCH;
        else mealTime = MealTime.DINNER;

        let item = await ctx.prisma.item.findFirst({
            where : {
                name : name,
                type : itemType
            }
        });

        if(!item){
            throw new Error("No such item found");
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