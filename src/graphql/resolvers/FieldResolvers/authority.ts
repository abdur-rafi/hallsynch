import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import {
    AuthorityRole,
    Authority,
    Announcement
} from "../../graphql-schema";
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

    @FieldResolver(type => [Announcement])
    async announcements(
        @Ctx() ctx : Context,
        @Root() authority : Authority
    ){
        return ctx.prisma.announcement.findMany({
            where : {
                authorityId: authority.authorityId
            }
        });
    }
}