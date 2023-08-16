import {Ctx, FieldResolver, Resolver, Root} from "type-graphql";
import {Photo, UploadedFile} from "../../graphql-schema";
import {Context} from "../../interface";


@Resolver(of => Photo)
export class PhotoResolver{

    @FieldResolver(type => UploadedFile)
    async file(
        @Ctx() ctx : Context,
        @Root() photo : Photo
    ){
        return await ctx.prisma.uploadedFile.findFirst({
            where : {
                uploadedFileId : photo.uploadedFileId
            }
        })
    }
}