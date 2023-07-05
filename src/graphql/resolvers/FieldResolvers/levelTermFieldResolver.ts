import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Batch, Department, LevelTerm, ResidencyStatus, Student } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => LevelTerm)
export class LevelTermResolver{

    @FieldResolver(type => [Student])
    async students(
        @Ctx() ctx : Context,
        @Root() lt : LevelTerm
    ){
        return await ctx.prisma.student.findMany({
            where : {
                levelTermId : lt.levelTermId
            }
        })
        // console.log(department.students);
        // return department.students;
    }
}