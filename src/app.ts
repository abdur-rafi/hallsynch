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
import { StudentResolver } from "./graphql/resolvers/FieldResolvers/studentFieldResolver";

const client = new PrismaClient()

buildSchema({
    resolvers : [queryResolver, mutationResolver, StudentResolver]
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