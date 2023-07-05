import { Arg, Authorized, Ctx, Mutation } from "type-graphql";
import { Context} from "../interface";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NewApplication, SeatApplication, UserWithToken } from "../graphql-schema";
import { roles } from "../utility";

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
        @Arg('q2') q2 : boolean
    ){

        let pendingApplication = await ctx.prisma.newApplication.findFirst({
            where : {
                AND : [
                    {
                        application : {
                            status : 'PENDING',
                            studentId : ctx.identity.studentId
                        }
                    }
                ]
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
                }
            },
            include : {
                application : true,
                questionnaire : true
            }
        })

        return application

    }
    

}