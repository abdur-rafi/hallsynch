import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Batch, Department, LevelTerm, Residency, ResidencyStatus, Student } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => Student)
export class StudentResolver{

    @FieldResolver(type => ResidencyStatus)
    residencyStatus(
        @Ctx() ctx : Context,
        @Root() student : Student
    ){
        return ResidencyStatus[student.residencyStatus]
    }

    @FieldResolver(type => Department)
    async department(
        @Ctx() ctx : Context,
        @Root() student : Student
    ){
        return await ctx.prisma.department.findUnique({
            where : {
                departmentId : student.departmentId
            }
        })
    }
    
    @FieldResolver(type => Batch)
    async batch(
        @Ctx() ctx : Context,
        @Root() student : Student
    ){
        return await ctx.prisma.batch.findUnique({
            where : {
                batchId : student.batchId
            }
        })
    }

    @FieldResolver(type => LevelTerm)
    async levelTerm(
        @Ctx() ctx : Context,
        @Root() student : Student
    ){
        return await ctx.prisma.levelTerm.findUnique({
            where : {
                levelTermId : student.levelTermId
            }
        })
    }
    
    @FieldResolver(type => Residency, {nullable : true})
    async residency(
        @Ctx() ctx : Context,
        @Root() student : Student
    ){
        return await ctx.prisma.residency.findUnique({
            where : {
                studentId : student.studentId
            }
        })
    }
    
}