import { AuthChecker } from "type-graphql";
import { Context } from "../interface";
import { roles } from "../utility";

export const authChecker : AuthChecker<Context> = async ({context}, currRoles)=>{

    // return context.userId != null;
    if(currRoles.includes(roles.STUDENT_ATTACHED)){
        console.log(context.identity);
        if(context.identity && context.identity.studentId){

            const std = await context.prisma.student.findUnique({
                where : {
                    studentId : context.identity.studentId
                }
            })
            return std.residencyStatus == 'ATTACHED';
        }
        else
            return false;

    } else if(currRoles.includes(roles.STUDENT_MESS_MANAGER)){
        console.log(context.identity);
        if(context.identity && context.identity.studentId){

            const std = await context.prisma.student.findUnique({
                where : {
                    studentId : context.identity.studentId
                }
            })
            return std.residencyStatus == 'RESIDENT';     // here additional checking may be required
        }
        else
            return false;
    }
    return true;
}