import "reflect-metadata";

import express from "express";
import { buildSchema } from "type-graphql";
import { queryResolver } from "./graphql/resolvers/queryResolver";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import {createServer} from 'http'


buildSchema({
    resolvers : [queryResolver]
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