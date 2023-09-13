import {Arg, Ctx, Mutation} from "type-graphql";
import {UserWithToken} from "../../graphql-schema";
import {Context} from "../../interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export class loginMutationResolver {

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
                    // assingedAt : {
                    //     lte : new Date(),
                    //     gt : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
                    // }
                    call: {
                        from: {
                            lte: new Date(),
                        },
                        to: {
                            gte: new Date(),
                        }
                    }
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
}