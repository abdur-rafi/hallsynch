import { Field, ObjectType, registerEnumType } from "type-graphql";


@ObjectType()
export class Department{
    @Field()
    departmentId : number;

    @Field()
    name : string
}

@ObjectType()
export class Student{
    @Field()
    studentId : number
    @Field()
    student9DigitId : string
    @Field()
    name : string 
    @Field()
    phone : string
    @Field()
    email : string
    @Field(type => ResidencyStatus)
    residencyStatus : ResidencyStatus


    @Field()
    departmentId : number 
    @Field()
    batchId : number
    @Field()
    levelTermId : number
}


export enum ResidencyStatus{
    ATTACHED,
    RESIDENT,
    TEMP_RESIDENT
}

registerEnumType(ResidencyStatus , {
    name : 'ResidencyStatus'
})

@ObjectType()
export class UserWithToken{
    @Field()
    student : Student

    @Field()
    token : string
}