import { Arg, Ctx, Mutation } from "type-graphql";
import { Context} from "../interface";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserWithToken } from "../graphql-schema";

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

        let token = jwt.sign(student.studentId.toString(), process.env.JWTSECRET!)
        console.log(token)
        return {
            student : student,
            token : token
        }

    }
}