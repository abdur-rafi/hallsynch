import {Arg, Authorized, Ctx, Mutation} from "type-graphql";
import {ratingTypes, roles} from "../../../utility";
import {Context} from "../../../interface";
import {IntArray} from "../../../graphql-schema";
import {RatingType} from "@prisma/client";

export class FeedbackMutationResolvers {

    @Authorized(roles.STUDENT_RESIDENT)
    @Mutation(returns => String)
    async postFeedback(
        @Ctx() ctx: Context,
        @Arg('ratings') ratings: IntArray,
        @Arg('comment', {
            nullable: true
        }) comment: string,
        @Arg('feedbackId') feedbackId: number
    ) {
        let residency = await ctx.prisma.residency.findUnique({
            where: {
                studentId: ctx.identity.studentId
            }
        })
        await ctx.prisma.$transaction([
            ctx.prisma.rating.createMany({
                data: ratingTypes.map((r, i) => ({
                    feedbackId: feedbackId,
                    rating: ratings.array[i],
                    residencyId: residency.residencyId,
                    type: RatingType[r]
                }))
            }),
            ctx.prisma.feedBackGiven.create({
                data: {
                    comment: comment,
                    feedBackId: feedbackId,
                    residencyId: residency.residencyId
                }
            })
        ])
        return "success";
    }
}