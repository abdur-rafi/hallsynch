import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {ApplicationStatus, MessManagerApplication, Residency, Student} from "../../graphql-schema";
import {Context} from "../../interface";


@Resolver(of => MessManagerApplication)
export class MessManagerApplicationResolver {

    @FieldResolver(type => ApplicationStatus)
    async status(
        @Ctx() ctx : Context,
        @Root() app : MessManagerApplication
    ){
        return ApplicationStatus[app.status];
    }

    @FieldResolver(type => Student)
    async student(
        @Ctx() ctx : Context,
        @Root() app : MessManagerApplication
    ){
        return await ctx.prisma.student.findFirst({
            where : {
                studentId : app.studentId
            }
        })
    }

    @FieldResolver(type => Residency)
    async residency(
        @Ctx() ctx : Context,
        @Root() app : MessManagerApplication
    ){
        return await ctx.prisma.residency.findFirst({
            where : {
                studentId : app.studentId
            }
        })
    }
}
