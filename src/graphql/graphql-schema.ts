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
export class ApplicationApproveHistory{
    @Field()
    applicationId : number;

    @Field()
    seatId : number;

    @Field()
    authorityId : number;

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
export class Seat{
    @Field()
    seatId : number;


    @Field()
    seatLabel : string;
    

    @Field()
    roomId : number;

    @Field(type => Room)
    room : ()=> Room;

    @Field(type => Residency, {nullable : true})
    residency? : () => Residency;

}

@ObjectType()
export class Room{
    @Field()
    roomId : number;

    @Field()
    roomNo : number;

    @Field()
    floorId : number;

    @Field(type => Floor)
    floor : Floor;

    @Field(type => [Seat])
    seats : [Seat];

    
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
    seatId : number
    
    // @Field(type => Student)
    // student : Student

    @Field(type => Seat)
    seat : Seat

    @Field()
    isCurrentMessManager : boolean;

    @Field()
    messManagerTimes : number;
    
}

@ObjectType()
export class TempResidency{
    @Field()
    residencyId : number;

    @Field()
    from : Date

    @Field()
    studentId : number
    
    @Field()
    seatId : number
    
    @Field()
    days : number

    // @Field(type => Student)
    // student : Student

    @Field(type => Seat)
    seat : Seat
    
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

    @Field(type => [TempResidencyHistory])
    tempResidencyHistory? : [TempResidencyHistory]
    // @Field(type =>)
    
}
@ObjectType()
export class TempResidencyHistory{
    @Field()
    tempResidencyHistoryId : number
    
    @Field()
    from : Date
    
    @Field()
    to : Date 
    
    @Field()
    studentId : number
    
    @Field()
    seatId : number;

    @Field(type => Seat)
    seat : Seat;
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

    @Field(type => MessManager, {nullable : true})
    messManager? : ()=> MessManager
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

    @Field(type => [Announcement], {nullable : true})
    announcements? : [Announcement]

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

    @Field(type => SeatChangeApplication, {nullable : true})
    seatChangeApplication? : () => SeatChangeApplication

    @Field(type => [AttachedFile], {nullable : true})
    attachedFiles : [AttachedFile]

    @Field(type => [Revision], {nullable : true})
    revisions : [Revision]

}

@ObjectType()
export class NewSeatQuestionnaire{
    @Field()
    questionnaireId : number;

    @Field()
    q1: boolean;

    @Field()
    q2: boolean;

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


    
}

@ObjectType()
export class TempApplication{
    
    @Field()
    from : Date

    @Field()
    days : number
    
    @Field()
    applicationId : number;

    @Field()
    questionnaireId : number;
    
    @Field()
    prefSeatId : number;


    @Field(type => SeatApplication)
    application : SeatApplication

    @Field(type => TempQuestionnaire)
    questionnaire : TempQuestionnaire

    @Field(type => Seat)
    prefSeat : Seat

}


@ObjectType()
export class SeatChangeApplication{
    
    @Field()
    seatChangeApplicationId : number
    
    @Field()
    reason : string;

    @Field()
    applicationId : number;
    
    @Field()
    toSeatId : number;

    @Field(type => SeatApplication)
    application : SeatApplication

    @Field(type => Seat)
    toSeat : Seat

    @Field(type => [Vote])
    votes : [Vote]

}

@ObjectType()
export class Revision{
    
    @Field()
    revisionId : number
    
    @Field()
    reason : string;

    @Field()
    createdAt : Date;
    
    @Field()
    applicationId : number;

    @Field(type => SeatApplication)
    application : SeatApplication
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
    seatChangeApplicationId : number;

    @Field()
    studentId : number;

    @Field(type => SeatChangeApplication)
    seatChangeApplication : SeatChangeApplication

    @Field(type => Student)
    student : Student;
    
 
}

@ObjectType()
export class AttachedFile{
    @Field()
    applicationId : number;

    @Field()
    uploadedFileId : number;

    @Field(type => UploadedFile)
    uploadedFile : ()=> UploadedFile

    @Field(type => SeatApplication)
    application : SeatApplication



}

@ObjectType()
export class UploadedFile{

    @Field()
    uploadedFileId : number;

    @Field()
    fileName : string;

    @Field()
    filePath : string;

    @Field()
    studentId : number;

    @Field(type => Student)
    student : Student;

    @Field()
    newFileName : string;

    // @Field(type => [AttachedFile])
    // attachedFiles : [AttachedFile]
    //
    // @Field(type => [Photo])
    // photos : [Photo]

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
    uploadedFileId : number;

    @Field(returns => UploadedFile)
    file : UploadedFile;

    // @Field(returns => [Item])
    // item: [Item];
}

@ObjectType()
export class Item{
    @Field()
    itemId : number;

    @Field()
    name : string;

    @Field(returns => ItemType)
    type : ItemType;

    @Field({nullable : true})
    photoId? : number;

    @Field(returns => Photo, {nullable : true})
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

    @Field(returns => [Preference], {nullable : true})
    preferences? : [Preference];

    @Field(returns => Student, {nullable : true})
    optedOut? : Student;
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

@InputType()
export class SingleCupCountInput {
    @Field()
    cupCount : number;

    @Field()
    itemId : number;
}

@InputType()
export class MealPlanInput {
    @Field(type => [SingleCupCountInput])
    items : [SingleCupCountInput];
}

@InputType()
export class SinglePreferenceInput {
    @Field()
    order : number;

    @Field()
    itemId : number;
}

@InputType()
export class PreferenceInput {
    @Field(type => [SinglePreferenceInput])
    preferences : [SinglePreferenceInput];
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

@ObjectType()
export class OptedOut {
    @Field()
    mealPlanId : number;

    @Field()
    residencyId : number;

    @Field()
    time : Date;

    @Field(returns => MealPlan)
    mealPlan : MealPlan;

    @Field(returns => Residency)
    residency : Residency;
}

@ObjectType()
export class MessManager {
    @Field()
    messManagerId : number;



    @Field()
    residencyId : number;

    @Field(type => Residency)
    residency : Residency;

    @Field(returns => [Announcement], {nullable : true})
    announcements? : [Announcement];

    @Field()
    callId : number;

    @Field(type => MessManagerApplicationCall)
    call : ()=> MessManagerApplicationCall;
}

@ObjectType()
export class MessManagerApplication {
    @Field()
    applicationId : number;

    @Field()
    appliedAt : Date;

    @Field(type => ApplicationStatus)
    status : ApplicationStatus

    @Field()
    residencyId : number;


    @Field(returns => Residency)
    residency : Residency;

    @Field()
    callId : number;

    @Field(type => MessManagerApplicationCall)
    call : ()=> MessManagerApplicationCall;
}

@ObjectType()
export class MessApplicationsWithCount{
    @Field(returns => [MessManagerApplication])
    applications : MessManagerApplication[];

    @Field()
    count : number;
}

@ObjectType()
export class Announcement {
    @Field()
    announcementId : number;

    @Field()
    title : string;

    @Field()
    details : string;

    @Field()
    createdAt : Date;

    @Field({nullable : true})
    authorityId? : number;

    @Field({nullable : true})
    messManagerId? : number;

    @Field(returns => Authority, {nullable : true})
    authority? : Authority;

    @Field(returns => MessManager, {nullable : true})
    messManager? : MessManager;
}


@InputType()
export class FilterInput{

    @Field(type => [String])
    batch : String[];

    @Field(type => [String])
    dept : String[];

    @Field(type => [String])
    status : String[];

    @Field(type => [String])
    type : String[];

    @Field(type => [String])
    lt : String[];

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

@ObjectType()
export class StatusWithDefaultSelect{
    @Field()
    status : String;

    @Field()
    select : Boolean;
};

@InputType()
export class IntArray{
    @Field(type => [Number])
    array : [number]
}


@ObjectType()
export class FullSeatStat {
    @Field()
    totalSeats : number;

    @Field()
    freeSeats : number;

    @Field()
    totalRooms : number;

    @Field()
    freeRooms : number;
}

@ObjectType()
export class FullStudentStat {
    @Field()
    totalStudents : number;

    @Field()
    totalResidents : number;

    @Field()
    totalTempResidents : number;

    @Field()
    totalAttached : number;
}

@ObjectType()
export class DeptWiseResident {
    @Field()
    deptName : string;

    @Field()
    totalResidents : number;
}

@InputType()
export class StudentFilterInput {
    @Field(type => [String])
    batch : String[];

    @Field(type => [String])
    dept : String[];

    @Field(type => [String])
    residencyStatus : String[];

    @Field(type => [String])
    levelTerm : String[];
}

@ObjectType()
export class StudentsWithCount {
    @Field(returns => [Student])
    students : Student[];

    @Field()
    count : number;
}

@ObjectType()
export class ResidencyStatusWithDefaultSelect{
    @Field()
    status : String;

    @Field()
    select : Boolean;
}

@ObjectType()
export class Notification {
    @Field()
    notificationId : number;

    @Field({nullable : true})
    applicationId? : number;

    @Field({nullable : true})
    voteId? : number;

    @Field()
    studentId : number;

    @Field()
    text : string;

    @Field()
    time : Date

    @Field()
    seen : Boolean

    @Field(returns => SeatApplication, {nullable : true})
    application? : SeatApplication;

    @Field(returns => Vote, {nullable : true})
    vote? : Vote;

    @Field(returns => Student)
    student : Student;
}

@ObjectType()
export class NotificationWithCount{
    @Field(type => [Notification])
    notifications : [Notification];

    @Field()
    unseenCount : number
}

@ObjectType()
export class MealPlanWithCount{
    @Field(type => MealPlan)
    mealPlan : MealPlan;

    @Field()
    _count : number;

}

@ObjectType()
export class ResidencyWithParticipationCount{
    @Field(type => Residency)
    residency : Residency;

    @Field()
    _count : number;

}


@ObjectType()
export class OptedOutCount{
    @Field()
    optedOut : number;

    @Field()
    total : number;

}

@ObjectType()
export class MealPreferenceStats{
    @Field()
    count : number;

    @Field()
    order : number;

    @Field()
    item : Item;

}

@ObjectType()
export class Feedback {
    @Field()
    feedbackId: number;
    @Field()
    startDate: Date
    @Field()
    startMealPlanId: number
    @Field()
    endMealPlanId: number


    @Field(type => MealPlan)
    startMealPlan: MealPlan
    @Field(type => MealPlan)
    endMealPlan: MealPlan
}

@ObjectType()
export class Rating{
    @Field()
    rating : number;

    @Field(type => RatingType)
    type : RatingType;

    @Field()
    feedbackId : number;

    @Field()
    residencyId : number;

    @Field(type => Feedback)
    feedback : Feedback;

    @Field(type => Residency)
    residency : Residency;

    @Field()
    giventAt : Date

}


@ObjectType()
export class FeedbackWithRating{
    @Field()
    avg : number;

    @Field()
    feedback : Feedback;

    @Field(type => RatingType)
    type : RatingType;

}

export enum RatingType{
    QUALITY,
    QUANTITY,
    MANAGEMENT
}
registerEnumType(RatingType , {
    name : 'RatingType'
})

@ObjectType()
export class MessManagerApplicationCall{
    @Field()
    callId : number;

    @Field()
    from : Date;

    @Field()
    to : Date;

    @Field()
    createdAt : Date;

    @Field()
    createdById : number;

    @Field(type => Authority)
    createdBy : Authority;

    @Field()
    applicationsCount : number;

    @Field()
    accepted : number;

    
    @Field(type => [MessManagerApplication])
    applications : [MessManagerApplication];


}

@ObjectType()
export class MessManagerCallWithAppsOfResident{
    @Field( type => MessManagerApplicationCall)
    call : MessManagerApplicationCall;

    @Field(type => MessManagerApplication, {nullable : true})
    application? : MessManagerApplication;
}