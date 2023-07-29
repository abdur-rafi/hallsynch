import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";




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
    @Field(type => Student, {nullable : true})
    student? : Student

    @Field()
    token : string
    
    @Field(type => Authority, {nullable : true})
    authority? : ()=> Authority
}

@ObjectType()
export class Authority{
    @Field()
    authorityId : number
    @Field()
    name : string
    @Field()
    email : string 
    @Field()
    phone : string
    @Field()
    password : string
    @Field(type => AuthorityRole)
    role :  AuthorityRole

}

export enum AuthorityRole{
    PROVOST,
    ASSISTANT_PROVOST,
    DINING_STUFF
}


registerEnumType(AuthorityRole , {
    name : 'AuthorityRole'
})


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

    @Field(type => NewApplication, {nullable : true})
    newApplication? : () => NewApplication

    @Field(type => TempApplication, {nullable : true})
    tempApplication? : () => TempApplication

    @Field(type => RoomChangeApplication, {nullable : true})
    roomChangeApplication? : () => RoomChangeApplication

}

@ObjectType()
export class NewSeatQuestionnaire{
    @Field()
    questionnaireId : number;

    @Field(type => NewApplication)
    application : ()=> NewApplication
}

@ObjectType()
export class TempQuestionnaire{
    @Field()
    questionnaireId : number;

    @Field(type => TempApplication)
    application : ()=> TempApplication
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
export class TempApplication{
    
    @Field()
    fromTime : Date

    @Field()
    days : number
    
    @Field()
    applicationId : number;

    @Field()
    questionnaireId : number;
    
    @Field()
    prefRoomId : number;


    @Field(type => SeatApplication)
    application : SeatApplication

    @Field(type => TempQuestionnaire)
    questionnaire : TempQuestionnaire

    @Field(type => Room)
    prefRoom : Room

}


@ObjectType()
export class RoomChangeApplication{
    
    @Field()
    roomChangeApplicationId : number
    
    @Field()
    reason : string;

    @Field()
    applicationId : number;
    
    @Field()
    toRoomId : number;

    @Field(type => SeatApplication)
    application : SeatApplication

    @Field(type => Room)
    toRoom : Room

    @Field(type => [Vote])
    votes : [Vote]
}

@ObjectType()
export class Vote{
    @Field()
    voteId : number

    @Field()
    reason : string
    
    @Field()
    lastUpdated : Date;

    @Field(type => VoteStatus)
    status : VoteStatus;
    
    @Field()
    roomChangeApplicationId : number;

    @Field()
    studentId : number;

    @Field(type => RoomChangeApplication)
    roomChangeApplication : RoomChangeApplication

    @Field(type => Student)
    student : Student;
 
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

export enum MealTime{
    LUNCH,
    DINNER
}

registerEnumType(MealTime , {
    name : 'MealTime'
})


export enum ItemType{
    RICE,
    VEG,
    NON_VEG
}

registerEnumType(ItemType , {
    name : 'ItemType'
})

export enum VoteStatus{
    YES,
    NO,
    NOT_VOTED
}
registerEnumType(VoteStatus , {
    name : 'VoteStatus'
})


@ObjectType()
export class Photo {
    @Field()
    photoId : number;

    @Field()
    filePath : string;

    // @Field(returns => Item)
    // item: Item;
}

@ObjectType()
export class Item{
    @Field()
    itemId : number;

    @Field()
    name : string;

    @Field(returns => ItemType)
    type : ItemType;

    @Field()
    photoId? : number;

    @Field(returns => Photo)
    photo? : Photo;

    @Field(returns => [Meal])
    meals : [Meal];

    @Field(returns => [CupCount])
    cupCounts : [CupCount];

    // @Field(returns => [Preference])
    // preferences : [Preference];
}

@ObjectType()
export class Meal {
    @Field()
    mealId : number;

    @Field()
    createdAt : Date;

    @Field(returns => [Item])
    items : [Item];

    @Field(returns => [MealPlan])
    mealPlans : [MealPlan];
}

@ObjectType()
export class MealPlan {
    @Field()
    mealPlanId : number;

    @Field()
    day: Date;

    @Field(returns => MealTime)
    mealTime : MealTime;

    @Field()
    mealId : number;

    @Field(returns => Meal)
    meal : Meal;

    @Field(returns => [CupCount])
    cupCount : [CupCount];

    @Field(returns => [Preference])
    preferences : [Preference];

    @Field(returns => [Student])
    optedOut : [Student];
}

@ObjectType()
export class CupCount {
    @Field()
    cupcount : number;

    @Field()
    mealPlanId : number;

    @Field()
    itemId : number;

    @Field(returns => MealPlan)
    mealPlan : MealPlan;

    @Field(returns => Item)
    item : Item;
}

@ObjectType()
export class Preference {
    @Field()
    order : number;

    @Field()
    mealPlanId : number;

    @Field()
    itemId : number;

    @Field()
    studentId : number;

    @Field(returns => MealPlan)
    mealPlan : MealPlan;

    @Field(returns => Item)
    item : Item;

    @Field(returns => Student)
    student : Student;
}


@InputType()
export class FilterInput{

    @Field({nullable : true})
    batch? : String;

    @Field({nullable : true})
    dept? : String;

    @Field({nullable : true})
    status? : String;

    @Field({nullable : true})
    type? : String;

    @Field({nullable : true})
    lt? : String;

}

@InputType()
export class SortInput{

    @Field({nullable : true})
    orderBy? : String;

    @Field({nullable : true})
    order? : String;
}

@InputType()
export class SearchInput{
    @Field({nullable : true})
    searchBy? : String;
}

@ObjectType()
export class SeatApplicationsWithCount{
    @Field(returns => [SeatApplication])
    applications : SeatApplication[];

    @Field()
    count : number;
}