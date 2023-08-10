import {Arg, Authorized, Ctx, Query, Resolver} from 'type-graphql'
import {
    Batch,
    Department,
    FilterInput,
    Floor, Item,
    LevelTerm,
    MealPlan, MealPlanWithCount,
    NotificationWithCount, ResidencyWithParticipationCount,
    Room,
    SearchInput,
    Seat,
    SeatApplication,
    SeatApplicationsWithCount,
    SortInput,
    StatusWithDefaultSelect,
    UserWithToken,
    Vote
} from '../graphql-schema'
import { Context } from '../interface'
import { applicationTypes, params, roles, sortVals } from '../utility';
import {ApplicationStatus, MealTime, Prisma} from '@prisma/client';

@Resolver()
export class queryResolver{
    @Query(returns => String)
    test(){
        return 'Hello world'
    }

    @Query(retunrs => UserWithToken)
    async selfInfo(
        @Ctx() ctx : Context
    ){
        if(!ctx.identity)
            throw new Error("Not authenticated");
        let student = undefined;
        if(ctx.identity.studentId){
            student = await ctx.prisma.student.findUnique({
                where : {studentId : ctx.identity.studentId}
            })
        }
        let authority = undefined;
        if(ctx.identity.authorityId){
            authority = await ctx.prisma.authority.findUnique({
                where : {authorityId : ctx.identity.authorityId}
            })
        }
        return {
            authority : authority,
            student : student,
            token : ''
        }
    }

    @Query(returns => [Department])
    async departments(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.department.findMany();
    }

    @Authorized(roles.PROVOST)
    @Query(returns =>SeatApplicationsWithCount)
    async applications(
        @Ctx() ctx : Context,
        @Arg('page') page : number,
        @Arg('filters', {nullable : true}) filters? : FilterInput,
        @Arg('sort', {nullable : true}) sort? : SortInput,
        @Arg('search', {nullable : true}) search? : SearchInput,
    ){
        let ands : Prisma.SeatApplicationWhereInput[] = []
        if(filters){
            if(filters.batch.length ){
                ands.push({
                    student : {
                        batch : {
                            year : {
                                in : filters.batch as string[]
                            }
                        }
                    }
                })
            }
            if(filters.dept.length){
                ands.push({
                    student : {
                        department : {
                            shortName : {
                                in : filters.dept as string[]
                            }
                        }
                    }
                })
            }
            if(filters.status.length){
                console.log(filters.status);
                let enumVal : ApplicationStatus[] = [];
                if(filters.status.includes('ACCEPTED')){
                    enumVal.push(ApplicationStatus.ACCEPTED);
                }
                if(filters.status.includes('REJECTED')){
                    enumVal.push(ApplicationStatus.REJECTED);
                }
                if(filters.status.includes('REVISE')){
                    enumVal.push(ApplicationStatus.REVISE)
                }
                if(filters.status.includes('PENDING')){
                    enumVal.push(ApplicationStatus.PENDING)
                }

                if(enumVal)
                    ands.push({
                        status : {
                            in : enumVal
                        }
                    })
            }0
            if(filters.type){
                let ors : Prisma.SeatApplicationWhereInput[] = [];
                if(filters.type.includes(applicationTypes.new) ){
                    ors.push({
                        NOT : { newApplication : null}
                    })
                }
                if(filters.type.includes(applicationTypes.room)){
                    ors.push({
                        NOT : { seatChangeApplication : null}
                    })
                }
                if(filters.type.includes(applicationTypes.temp)){
                    ors.push({
                        NOT : { tempApplication : null}
                    })
                }
                ands.push({
                    OR : ors
                })
            }
            if(filters.lt.length){
                ands.push({
                    student : {
                        levelTerm : {
                            label :  {
                                in : filters.lt as string[]
                            }
                        }
                    }
                })
            }
        
        }
        if(search && search.searchBy && search.searchBy.trim().length > 0){
            ands.push({
                OR : [
                    {
                        student : {
                            name : {
                                contains : search.searchBy as string
                            }
                        }
                    },
                    {
                        student : {
                            student9DigitId : {
                                contains : search.searchBy as string
                            }
                        }
                    }
                ]
            })
        }
        let order : Prisma.SeatApplicationOrderByWithRelationInput = {}
        if(sort){
            if(sort.orderBy && sort.order ){
                if(sort.orderBy == 'Batch')
                    order = {   
                        student : {
                            batch : {
                                year : (sort.order == sortVals.oldest) ? 'asc' : 'desc'
                            }
                        }
                    }   
                else
                    order = {   
                        createdAt : sort.order == sortVals.oldest ? 'asc' : 'desc'
                    }
            }
            
            // console.log(order);
        }
        // let count = await 

        let result = await ctx.prisma.$transaction([
            ctx.prisma.seatApplication.count({
                where : {
                    AND : ands
                }
            }),
            ctx.prisma.seatApplication.findMany({
                take : params.provostApplicationPerPageCount,
                skip : (page-1) * params.provostApplicationPerPageCount,
                where : {
                    AND : ands
                },
                orderBy : order
            }),
            
        ])

        return {
            applications : result[1],
            count : result[0]
        }

        // return await ctx.prisma.seatApplication.findMany({
        //     // take : params.provostApplicationCount,
            
        //     orderBy : order,
        //     where : {
        //         AND : ands,   
        //     }
        // })
    }

    @Authorized(roles.STUDENT)
    @Query(returns =>[SeatApplication])
    async myapplications(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.seatApplication.findMany({
            orderBy : {
                createdAt : 'desc'
            },
            where : {
                studentId : ctx.identity.studentId
            }
        })
    }

    @Authorized(roles.STUDENT_RESIDENT)
    @Query(returns => [Vote])
    async pendingVotes(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.vote.findMany({
            where : {
                studentId : ctx.identity.studentId,
                status : "NOT_VOTED"
            }
        })
    }
    
    @Query(returns => [Batch])
    async batches(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.batch.findMany({
            orderBy : {
                year : 'asc'
            }
        })
    }
    
    
    @Query(returns => [StatusWithDefaultSelect])
    async applicationStatus(
        @Ctx() ctx : Context
    ){
        return [{
            status : 'PENDING',
            select : true
        },
        {
            status : 'REVISE',
            select : true
        },
        {
            status : 'ACCEPTED',
            select : false
        },
        {
            status : 'REJECTED',
            select : false
        }
        ]
    }

    @Query(returns => [String])
    async applicationTypes(
        @Ctx() ctx : Context
    ){
        return [
            applicationTypes.new,
            applicationTypes.temp,
            applicationTypes.room
        ]
    }
    
    @Query(returns => [LevelTerm])
    async levelTerms(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.levelTerm.findMany();
    }
    

    @Query(returns => Seat)
    async freeSeat(
        @Ctx() ctx : Context
    ){
        return await ctx.prisma.seat.findFirst({
            where : {
                residency : null,
                tempResidency : null
            }
        })
    }

    @Query(returns => SeatApplication)
    async applicationDetails(
        @Ctx() ctx : Context,
        @Arg('applicationId') applicationId : number
    ){
        return await ctx.prisma.seatApplication.findUnique({
            where : {
                applicationId : applicationId
            }
        })
    }

    @Query(returs => [Floor])
    async freeFloors(
        @Ctx() ctx : Context,
    ){
        return await ctx.prisma.floor.findMany({
            where : {
                rooms : {
                    some : {
                        seats : {
                            some : {
                                residency : null,
                                tempResidency : null
                            }
                        }
                    }
                }
            },
            orderBy : {
                floorNo : 'asc'
            }
        })
    }

    
    @Query(returns => [Room])
    async freeRoomInFloor(
        @Ctx() ctx : Context,
        @Arg('floorNo') floorNo : number
    ){
        return await ctx.prisma.room.findMany({
            where : {
                seats : {
                    some : {
                        tempResidency : null,
                        residency : null
                    }
                },
                floor : {
                    floorNo : floorNo
                }
            },
            orderBy : {
                roomNo : 'asc'
            }
        })
    }

    
    @Query(returns => [Seat])
    async freeSeatInRoom(
        @Ctx() ctx : Context,
        @Arg('floorNo') floorNo : number,
        @Arg('roomNo') roomNo : number
    ){
        return await ctx.prisma.seat.findMany({
            where : {
                room : {
                    roomNo : roomNo,
                    floor : {
                        floorNo : floorNo
                    }
                },
                residency : null,
                tempResidency : null
            },
            orderBy : {
                seatLabel : 'asc'
            }
        })
    }

    
    @Authorized([roles.STUDENT])
    @Query(returns => NotificationWithCount)
    async notifications(
        @Ctx() ctx : Context
    ){  
        let t = await ctx.prisma.$transaction([
            ctx.prisma.notification.count({
                where : {
                    studentId : ctx.identity.studentId,
                    seen : false
                }
            }),
            ctx.prisma.notification.findMany({
                where : {
                    studentId : ctx.identity.studentId
                },
                
            })
        ])

        return {
            unseenCount : t[0],
            notifications : t[1]
        }
    }

    @Authorized([roles.STUDENT])
    @Query(returns => MealPlan)
    async getMealPlan(
        @Ctx() ctx: Context,
        @Arg('date') date : string,
        @Arg('mealTime') mealtime : string
    ) {

        let mealTime : MealTime;
        if(mealtime.toLowerCase() == 'lunch') mealTime = MealTime.LUNCH;
        else mealTime = MealTime.DINNER;

        return await ctx.prisma.mealPlan.findFirst({
            where: {
                day: new Date(date),
                mealTime: mealTime
            }
        });
    }

    @Authorized([roles.STUDENT])
    @Query(returns => [Item])
    async getOldItems(
        @Ctx() ctx: Context,
    ) {
        return await ctx.prisma.item.findMany();
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
                mealTime : mealTime == 'DINNER' ? MealTime['DINNER'] : MealTime['LUNCH']
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



}
