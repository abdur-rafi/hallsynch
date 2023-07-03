import { Field, ObjectType, registerEnumType } from "type-graphql";


@ObjectType()
export class Department{
    @Field()
    departmentId : number;

    @Field()
    name : string
}