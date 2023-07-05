import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Department, ResidencyStatus, Student } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => Department)
export class DepartmentResolver{

    @FieldResolver(type => [Student])
    async students(
        @Ctx() ctx : Context,
        @Root() department : Department
    ){
        return await ctx.prisma.student.findMany({
            where : {
                departmentId : department.departmentId
            }
        })
        // console.log(department.students);
        // return department.students;
    }
}