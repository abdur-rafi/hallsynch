import {Arg, Authorized, Ctx, Query, Resolver} from 'type-graphql'
import { Batch, Department, FilterInput, LevelTerm, SearchInput, SeatApplication, SeatApplicationsWithCount, SortInput, StatusWithDefaultSelect, Student, Vote } from '../graphql-schema'
import { Context } from '../interface'
import { applicationTypes, params, roles, sortVals } from '../utility';
import { ApplicationStatus, Prisma } from '@prisma/client';
@Resolver()
export class queryResolver{
    @Query(returns => String)
    test(){
        return 'Hello world'
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
                        NOT : { roomChangeApplication : null}
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
    
    // @Query
}
