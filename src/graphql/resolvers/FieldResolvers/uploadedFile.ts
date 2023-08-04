import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AuthorityRole, ApplicationStatus, Authority, NewApplication, SeatChangeApplication, SeatApplication, TempApplication, AttachedFile, UploadedFile, Student } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => UploadedFile)
export class UploadedFileResolver{

    @FieldResolver(type => Student )
    async student(
        @Ctx() ctx : Context,
        @Root() a : UploadedFile
    ){
        return await ctx.prisma.student.findUnique({
            where : {
                studentId : a.studentId
            }
        })
    }
    
    
}