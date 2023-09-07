import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Announcement, Authority, MessManager, Student} from "../../graphql-schema";
import {Context} from "../../interface";
import { Complaint } from "../../graphql-schema";
import { ComplaintPayload } from "@prisma/client";
import { ComplaintType } from "@prisma/client";


@Resolver(of => Complaint )
export class ComplaintResolver{

    @FieldResolver(type => String)
    async complaintType(
        @Ctx() ctx : Context,
        @Root() complaint : Complaint
    ){
        return ComplaintType[complaint.type];
    }

    // field resolver for student
    @FieldResolver(type => Student)
    async student(
        @Ctx() ctx : Context,
        @Root() complaint : Complaint
    ){
        return ctx.prisma.student.findUnique({
            where : {
                studentId : complaint.studentId
            }
        });
    }

    
}