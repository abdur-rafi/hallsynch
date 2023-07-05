import { Field, ObjectType, registerEnumType } from "type-graphql";


@ObjectType()
export class Department{
    @Field()
    departmentId : number;

    @Field()
    name : string

    @Field()
    shortName : string
    
    @Field()
    deptCode : string
    
    @Field(type => [Student])
    students : [Student]
}

@ObjectType()
export class Batch{
    @Field()
    batchId : number;

    @Field()
    year : string

    @Field(type => [Student])
    students : [Student]
}

@ObjectType()
export class LevelTerm{
    @Field()
    levelTermId : number;

    @Field()
    label : string

    @Field(type => [Student])
    students : [Student]
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

    @Field(type => Department)
    department : Department

    @Field(type => Batch)
    batch : Batch
    
    @Field(type => LevelTerm)
    levelTerm : LevelTerm
    

}


@ObjectType()
export class Residency{
    @Field()
    residencyId : number;

    @Field()
    from : Date

    @Field()
    studentId : number
    
    @Field()
    roomId : number
    
    @Field(type => Student)
    student : Student
}



@ObjectType()
export class Floor{
    @Field()
    floorId : number;

    @Field()
    floorNo : number;

    @Field()
    roomLabelLen : number;

    @Field(type => [Room])
    rooms : [Room]

}




@ObjectType()
export class Room{
    @Field()
    roomId : number;

    @Field()
    roomNo : number;

    @Field()
    roomCapacity : number;

    @Field()
    floorId : number;

    @Field(type => Floor)
    floor : Floor;
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