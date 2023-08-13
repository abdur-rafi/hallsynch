import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AuthorityRole, ApplicationStatus, Authority, NewApplication, SeatChangeApplication, SeatApplication, TempApplication, AttachedFile, UploadedFile, FeedbackWithRating, RatingType } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => FeedbackWithRating)
export class FeedbackWithRatingResolver{

    @FieldResolver(type => RatingType)
    async type(
        @Ctx() ctx : Context,
        @Root() a : FeedbackWithRating
    ){
        return RatingType[a.type]
    }

    
}