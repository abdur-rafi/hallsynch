import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ResidencyStatus, Student } from "../../graphql-schema";
import { Context } from "apollo-server-core";

@Resolver(of => Student)
export class StudentResolver{

    @FieldResolver(type => ResidencyStatus)
    residencyStatus(
        @Ctx() ctx : Context,
        @Root() student : Student
    ){
        return ResidencyStatus[student.residencyStatus]
    }
}