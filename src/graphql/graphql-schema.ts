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
    
    // @Field(type => Student)
    // student : Student

    @Field(type => Room)
    room : Room
    
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

    @Field(type => Residency, {nullable : true})
    residency? : Residency

    @Field(type =>[SeatApplication])
    applications : [SeatApplication]
    
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


export enum ApplicationStatus{
    PENDING,
    ACCEPTED,
    REJECTED,
    REVISE
}


registerEnumType(ApplicationStatus , {
    name : 'ApplicationStatus'
})


@ObjectType()
export class SeatApplication{
    @Field()
    applicationId : number;

    @Field()
    createdAt : Date

    @Field()
    lastUpdate : Date

    @Field(type => ApplicationStatus)
    status : ApplicationStatus

    @Field()
    studentId : number
    
    @Field(type => Student)
    student : Student    

    @Field(type => NewApplication)
    newApplication? : () => NewApplication

}

@ObjectType()
export class NewSeatQuestionnaire{
    @Field()
    questionnaireId : number;

    @Field(type => NewApplication)
    application : ()=> NewApplication
}

@ObjectType()
export class NewApplication{
    @Field()
    newApplicationId : number;

    @Field()
    applicationId : number;

    @Field()
    questionnaireId : number;

    @Field(type => SeatApplication)
    application : SeatApplication

    @Field(type => NewSeatQuestionnaire)
    questionnaire : NewSeatQuestionnaire

    @Field(type => [AttachedFiles])
    attachedFiles : [AttachedFiles]

    
}


@ObjectType()
export class AttachedFiles{
    @Field()
    fileId : number;

    @Field()
    fileName : string;

    @Field()
    filePath : string;

    @Field()
    newApplicationId : number;


    @Field(type => NewApplication)
    application : NewApplication

}


