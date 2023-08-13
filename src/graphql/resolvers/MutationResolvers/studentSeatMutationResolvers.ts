import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {roles} from "../../utility";
import {IntArray, NewApplication, SeatChangeApplication, TempApplication, Vote} from "../../graphql-schema";
import {Context} from "../../interface";


export class studentSeatMutationResolver {

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
}