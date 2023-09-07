import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Student} from "../../graphql-schema";
import {Context} from "../../interface";
import { Complaint } from "../../graphql-schema";
import { ComplaintType } from "../../graphql-schema";


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