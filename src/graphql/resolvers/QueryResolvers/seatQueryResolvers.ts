import {Arg, Authorized, Ctx, Query} from "type-graphql";
import {
    DeptWiseResident,
    FilterInput, Floor, FullSeatStat, FullStudentStat, IntArray, NotificationWithCount, Room,
    SearchInput, Seat,
    SeatApplication,
    SeatApplicationsWithCount,
    SortInput, StatusWithDefaultSelect, Student,
    Vote
} from "../../graphql-schema";
import {Context} from "../../interface";
import {ApplicationStatus, Prisma} from "@prisma/client";
import { applicationTypes, params, roles, sortVals } from '../../utility'


export class seatQueryResolver {

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
            }
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

    @Query(returns => FullSeatStat)
    async fullSeatStats(
        @Ctx() ctx : Context
    ){
        let totalSeat = await ctx.prisma.seat.count();

        let freeSeat = await ctx.prisma.seat.count({
            where : {
                residency : null,
                tempResidency : null
            }
        });

        let totalRooms = await ctx.prisma.room.count();

        let freeRooms = await ctx.prisma.room.count({
            where : {
                seats : {
                    some : {
                        residency : null,
                        tempResidency : null
                    }
                }
            }
        });

        return {
            totalSeats : totalSeat,
            freeSeats : freeSeat,
            totalRooms : totalRooms,
            freeRooms : freeRooms
        };
    }

    @Query(returns => FullStudentStat)
    async fullStudentStats(
        @Ctx() ctx : Context
    ) {
        let totalStudent = await ctx.prisma.student.count();

        let totalResident = await ctx.prisma.residency.count();

        let totalTempResident = await ctx.prisma.tempResidency.count();

        let totalAttached = totalStudent - totalResident - totalTempResident;

        return {
            totalStudents : totalStudent,
            totalResidents : totalResident,
            totalTempResidents : totalTempResident,
            totalAttached : totalAttached
        }
    }

    @Query(returns => [DeptWiseResident])
    async departmentWiseResidentStats(
        @Ctx() ctx : Context
    ){
        let result : DeptWiseResident[] = [];
        let depts = await ctx.prisma.department.findMany({
            select : {
                shortName : true,
                departmentId : true
            }
        });

        for (const dept of depts) {
            let count = await ctx.prisma.residency.count({
                where : {
                    student : {
                        departmentId : dept.departmentId
                    }
                }
            });
            result.push({
                deptName : dept.shortName,
                totalResidents : count
            })
        }

        return result;
    }

    @Query(returns => [Number])
    async allFloors(
        @Ctx() ctx : Context
    ) {
        let res = await ctx.prisma.floor.findMany({
            orderBy : {
                floorNo : 'asc'
            }
        })

        let arr : Number[] = [];
        for (const floor of res) {
            arr.push(floor.floorNo);
        }

        return arr;
    }

    @Query(returns => [Room])
    async selectedFloorRooms(
        @Ctx() ctx : Context,
        @Arg('floorNo') floorNo : number,
        @Arg('roomStatus') roomStatus : string,
        @Arg('residentType') residentType : string
    ){
        let ands : Prisma.RoomWhereInput[] = [];

        if(roomStatus.toLowerCase() == 'free'){
            ands.push({
                seats : {
                    some : {
                        residency : null,
                        tempResidency : null
                    }
                }
            })
        } else if(roomStatus.toLowerCase() == 'occupied'){
            ands.push({
                seats : {
                    none : {
                        residency : null,
                    }
                }
            })
        }

        if(residentType.toLowerCase() == 'resident'){
            ands.push({
                seats : {
                    some : {
                        NOT : {
                            residency : null
                        }
                    }
                }
            })
        } else if(residentType.toLowerCase() == 'temp resident'){
            ands.push({
                seats : {
                    some : {
                        NOT : {
                            tempResidency : null
                        }
                    }
                }
            })
        }

        return await ctx.prisma.room.findMany({
            where : {
                floor : {
                    floorNo : floorNo
                },
                AND : ands
            },
            orderBy : {
                roomNo : 'asc'
            }
        });
    }

    @Query(returns => [Student])
    async selectedRoomStudents(
        @Ctx() ctx : Context,
        @Arg('roomId') roomId : number
    ) {
        return await ctx.prisma.student.findMany({
            where : {
                OR: [
                    {
                        residency: {
                            seat: {
                                roomId: roomId
                            }
                        }
                    },
                    {
                        tempResidency: {
                            seat: {
                                roomId: roomId
                            }
                        }
                    }
                ]
            }
        })
    }


    @Authorized([roles.STUDENT])
    @Query(returns => NotificationWithCount)
    async notifications(
        @Ctx() ctx : Context
    ){
        if(!ctx.identity.studentId) return [];
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
                orderBy : {
                    time : "desc"
                }

            })
        ])

        return {
            unseenCount : t[0],
            notifications : t[1]
        }
    }

    
}