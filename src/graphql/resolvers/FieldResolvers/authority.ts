import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { AuthorityRole, ApplicationStatus, Authority, NewApplication, RoomChangeApplication, SeatApplication, TempApplication } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => Authority)
export class AuthorityResolver{

    @FieldResolver(type => AuthorityRole )
    async role(
        @Ctx() ctx : Context,
        @Root() authority : Authority
    ){
        return AuthorityRole[authority.role];
    }

    
}