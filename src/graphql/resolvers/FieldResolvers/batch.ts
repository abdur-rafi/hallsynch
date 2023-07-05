import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Batch, Department, ResidencyStatus, Student } from "../../graphql-schema";
import { Context } from "../../interface";

@Resolver(of => Batch)
export class BatchResolver{

    @FieldResolver(type => [Student])
    async students(
        @Ctx() ctx : Context,
        @Root() batch : Batch
    ){
        return await ctx.prisma.student.findMany({
            where : {
                batchId : batch.batchId
            }
        })
    }
}