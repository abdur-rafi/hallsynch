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
        // console.log(std);
        if(currRoles.includes(roles.STUDENT_ATTACHED)){
            console.log('here1');
            return std.residencyStatus == 'ATTACHED';
    
        }
        if(currRoles.includes(roles.STUDENT_MESS_MANAGER)){
            console.log('here2');
            return std.residencyStatus == 'RESIDENT';     // here additional checking may be required
        }
        
        if(currRoles.includes(roles.STUDENT_RESIDENT)){
            console.log(context);
            console.log('here3');
            return std.residencyStatus == 'RESIDENT' ;        
        }
        // else{
        //     console.log('no roles match');
        // }
    }
    else{
        console.log("not authenticated");
    }
    // return context.userId != null;
    return true;
}