require('dotenv').config()
import "reflect-metadata";

import express from "express";
import { buildSchema } from "type-graphql";
import { queryResolver } from "./graphql/resolvers/queryResolver";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import {createServer} from 'http'
import { Context } from "./graphql/interface";
import { PrismaClient } from "@prisma/client";
import { mutationResolver } from "./graphql/resolvers/mutationResolvers";
import { StudentResolver } from "./graphql/resolvers/FieldResolvers/student";
import { DepartmentResolver } from "./graphql/resolvers/FieldResolvers/department";
import { BatchResolver } from "./graphql/resolvers/FieldResolvers/batch";
import { LevelTermResolver } from "./graphql/resolvers/FieldResolvers/levelTerm";
import { ResidencyResolver } from "./graphql/resolvers/FieldResolvers/residency";
import { getIdentity } from "./graphql/utility";
import { authChecker } from "./graphql/resolvers/authChecker";
import { NewApplicationResolver } from "./graphql/resolvers/FieldResolvers/newApplication";
import { SeatApplicationResolver } from "./graphql/resolvers/FieldResolvers/seatApplication";

const client = new PrismaClient()

buildSchema({
    resolvers : [
        queryResolver, 
        mutationResolver, 
        StudentResolver, 
        DepartmentResolver,
        BatchResolver,
        LevelTermResolver,
        ResidencyResolver,
        NewApplicationResolver,
        SeatApplicationResolver
        
    ],
    authChecker : authChecker
}).then(schema => {
    
    const app = express();
    const httpServer = createServer(app);

    
    const server = new ApolloServer({
        schema : schema,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground(), {
            // async serverWillStart() {
            //     return {
            //         async drainServer() {
            //             subscriptionServer.close();
            //         }
            //     };
            // }
        }],
        context : ({req}) : Context =>{
            return {
                identity : getIdentity(req.headers),
                prisma : client
            }
        }
        // context : ({req}) : Context =>{
        //     let token = ''
        //     let userId : number | undefined;
        //     if(req.headers.authorization){
        //         token = req.headers.authorization.replace('Bearer ', '')
        //     }
        //     if(token.length > 0){
        //         let payload = jwt.verify(token, process.env.JWTSECRET!) as string;
        //         userId = parseInt(payload)

        //     }
        //     return({
        //         prisma : prisma,
        //         userId : userId
        //     })
        // }
    })

    server.start().then(()=>{
        server.applyMiddleware({
            app,
            path: '/graphql'
        });
        
        app.use('/', (req, res, next)=>{
            res.send('response')
        })
    
        httpServer.listen({ port: 3000 }, ()=>{
            console.log('App running at port 3000')
        })
    })

})

// app.get('/', (req, res)=>{
//     res.send("hello world");
// })


// app.listen(3000, ()=>{
//     console.log('server listening');
// })