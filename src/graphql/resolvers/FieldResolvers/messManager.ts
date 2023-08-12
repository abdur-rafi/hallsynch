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
        return ctx.prisma.student.findUnique({
            where : {
                studentId : messManager.studentId
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