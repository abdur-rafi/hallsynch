import { AuthChecker } from "type-graphql";
import { Context } from "../interface";
import { roles } from "../utility";

export const authChecker : AuthChecker<Context> = async ({context}, currRoles)=>{

    
    if(context.identity && context.identity.studentId){

        const std = await context.prisma.student.findUnique({
            where : {
                studentId : context.identity.studentId
            }
        })
        if(currRoles.includes(roles.STUDENT_ATTACHED)){
            return std.residencyStatus == 'ATTACHED';
    
        } else if(currRoles.includes(roles.STUDENT_MESS_MANAGER)){
            return std.residencyStatus == 'RESIDENT';     // here additional checking may be required
        }
        else if(currRoles.includes(roles.STUDENT_RESIDENT)){
            console.log(context);
            return std.residencyStatus == 'RESIDENT' ;        
        }
    }
    // return context.userId != null;
    return true;
}