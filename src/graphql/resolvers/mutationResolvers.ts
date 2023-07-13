import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {Context} from "../interface";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {Arr, CupCount, NewApplication, RoomChangeApplication, TempApplication, UserWithToken} from "../graphql-schema";
import {roles} from "../utility";
import {ItemType, MealTime} from "@prisma/client";

export class mutationResolver{
    
    @Mutation(returns => UserWithToken)
    async login(
        @Ctx() ctx : Context,
        @Arg('id') id : string,
        @Arg('password') password : string
    ){
        console.log(id);
        let student = await ctx.prisma.student.findUnique({where : {student9DigitId : id}})
        console.log(student)
        if(!student){
            throw new Error("No User Found");
        }
        let b = await bcrypt.compare(password, student.password)
        if(!b){
            throw new Error("Invalid password");
        }

        let token = jwt.sign({
            studentId : student.studentId
        }, process.env.JWTSECRET!)
        // console.log(token)
        return {
            student : student,
            token : token
        }

    }

    @Authorized(roles.STUDENT_ATTACHED)
    @Mutation(returns => NewApplication)
    async newSeatApplication(
        @Ctx() ctx : Context,
        @Arg('q1') q1 : boolean,
        @Arg('q2') q2 : boolean,
        @Arg('attachedFileIds') attachedFileIds : string
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

        if( pendingApplication ){
            throw new Error("One application still pending");
        }

        let application = await ctx.prisma.newApplication.create({
            data : {
                application : {
                    create : {
                        createdAt : new Date(),
                        lastUpdate : new Date(),
                        status : 'PENDING',
                        studentId : ctx.identity.studentId
                    }
                },
                questionnaire : {
                    create : {
                        q1 : q1,
                        q2 : q2
                    }
                },
                // attachedFiles : {
                //     connect : 
                //         attachedFileIds.split(" ").map(v => ({
                //             fileId : parseInt(v)
                //         }))
                    
                // }
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
        @Arg('roomPref') roomPref : number,
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
                prefRoom : {
                    connect : {
                        roomId : roomPref
                    }
                },
                days : days,
                from : new Date(from)
            },
            include : {
                applicaiton : true,
                questionnaire : true
            }
        })

        return application
    }

    
    @Authorized(roles.STUDENT_RESIDENT)
    @Mutation(returns => RoomChangeApplication)
    async roomChangeApplication(
        @Ctx() ctx : Context,
        @Arg('roomId') roomId : number,
        @Arg('reason') reason : string
    ){
        let pendingApplication = await ctx.prisma.roomChangeApplication.findFirst({
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

        let application = await ctx.prisma.roomChangeApplication.create({
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
                        roomId : roomId
                    }
                },
                reason : reason
            },
            include : {
                application : true
            }
        })

        return application
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
}