import { AuthChecker } from "type-graphql";
import { Context } from "../interface";
import { roles } from "../utility";

export const authChecker : AuthChecker<Context> = async ({context}, currRoles)=>{

    console.log("in auth checker", context.identity, currRoles);
    if(context.identity && context.identity.studentId){

        const std = await context.prisma.student.findUnique({
            where : {
                studentId : context.identity.studentId
            }
        })

        if(currRoles.includes(roles.STUDENT_ATTACHED)){
            console.log('here1');
            return std.residencyStatus == 'ATTACHED';
    
        }

        if(currRoles.includes(roles.STUDENT_RESIDENT)){
            console.log('here3');
            return std.residencyStatus == 'RESIDENT' ;
        }

        if(currRoles.includes(roles.STUDENT_MESS_MANAGER)){
            console.log('here2');
            if(std.residencyStatus != 'RESIDENT'){
                return false;
            }

            return context.identity.messManagerId != null;
        }
    }
    else{
        console.log("not authenticated");
    }
    return true;
}