import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Announcement, MessManager, Student} from "../../graphql-schema";
import {Context} from "../../interface";

@Resolver(of => MessManager)
export class MessManagerResolver{

    @FieldResolver(type => Student)
    async student(
        @Ctx() ctx : Context,
        @Root() messManager : MessManager
    ){
        if(!messManager) return null;
        return ctx.prisma.student.findFirst({
            where : {
                studentId : messManager.studentStudentId
            }
        });
    }

    @FieldResolver(type => [Announcement])
    async announcements(
        @Ctx() ctx : Context,
        @Root() messManager : MessManager
    ){
        return ctx.prisma.announcement.findMany({
            where : {
                messManagerId: messManager.messManagerId
            }
        });
    }
}