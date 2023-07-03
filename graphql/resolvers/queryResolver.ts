import {Query, Resolver} from 'type-graphql'
@Resolver()
export class queryResolver{
    @Query(returns => String)
    test(){
        return 'Hello world'
    }
}
