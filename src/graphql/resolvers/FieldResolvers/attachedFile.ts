import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AuthorityRole, ApplicationStatus, Authority, NewApplication, SeatChangeApplication, SeatApplication, TempApplication, AttachedFile, UploadedFile } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => AttachedFile)
export class AttachedFileResolver{

    @FieldResolver(type => UploadedFile)
    async uploadedFile(
        @Ctx() ctx : Context,
        @Root() a : AttachedFile
    ){
        console.log("a : ", a)
        return await ctx.prisma.uploadedFile.findUnique({
            where : {
                uploadedFileId : a.uploadedFileId
            }
        })
    }

    
}