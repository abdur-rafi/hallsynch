require('dotenv').config()
import "reflect-metadata";

import express from "express";
import { buildSchema } from "type-graphql";
import { queryResolver } from "./graphql/resolvers/queryResolver";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { createServer } from 'http'
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
import { CupCountResolver } from "./graphql/resolvers/FieldResolvers/cupCount";
import { ItemResolver } from "./graphql/resolvers/FieldResolvers/item";
import { MealPlanResolver } from "./graphql/resolvers/FieldResolvers/mealPlan";
import { MealResolver } from "./graphql/resolvers/FieldResolvers/meal";
import { TempApplicationResolver } from "./graphql/resolvers/FieldResolvers/tempApplication";
import { SeatChangeApplicationResolver } from "./graphql/resolvers/FieldResolvers/seatChangeApplication";

import cors from 'cors'
import bodyParser, { json } from 'body-parser'
import { VoteResolver } from "./graphql/resolvers/FieldResolvers/vote";
import { AuthorityResolver } from "./graphql/resolvers/FieldResolvers/authority";
import { SeatResolver } from "./graphql/resolvers/FieldResolvers/seat";
import { FloorResolver } from "./graphql/resolvers/FieldResolvers/floor";
import { RoomResolver } from "./graphql/resolvers/FieldResolvers/room";

import path from 'path'
import formidable from 'formidable'

import { AttachedFileResolver } from "./graphql/resolvers/FieldResolvers/attachedFile";
import { UploadedFileResolver } from "./graphql/resolvers/FieldResolvers/uploadedFile";
import { TempResidencyHistoryResolver } from "./graphql/resolvers/FieldResolvers/tempResidencyHistory";
import { TempResidencyResolver } from "./graphql/resolvers/FieldResolvers/tempResidency";
import {PhotoResolver} from "./graphql/resolvers/FieldResolvers/photo";
import {PreferenceResolver} from "./graphql/resolvers/FieldResolvers/preference";


const client = new PrismaClient()

buildSchema({
    resolvers: [
        queryResolver,
        mutationResolver,
        StudentResolver,
        DepartmentResolver,
        BatchResolver,
        LevelTermResolver,
        ResidencyResolver,
        NewApplicationResolver,
        SeatApplicationResolver,
        CupCountResolver,
        ItemResolver,
        MealPlanResolver,
        MealResolver,
        TempApplicationResolver,
        SeatChangeApplicationResolver,
        VoteResolver,
        AuthorityResolver,
        SeatResolver,
        RoomResolver,
        FloorResolver,
        AttachedFileResolver,
        UploadedFileResolver,
        TempResidencyHistoryResolver,
        TempResidencyResolver,
        PhotoResolver,
        PreferenceResolver
    ],
    authChecker: authChecker
}).then(schema => {

    const app = express();
    const httpServer = createServer(app);


    const server = new ApolloServer<Context>({
        schema: schema,
        plugins: [ApolloServerPluginLandingPageLocalDefault(), {
            // async serverWillStart() {
            //     return {
            //         async drainServer() {
            //             subscriptionServer.close();
            //         }
            //     };
            // }
        }],
        // context : ({req}) : Context =>{
        //     return {
        //         identity : getIdentity(req.headers),
        //         prisma : client
        //     }
        // }
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

    server.start().then(() => {
        // server.applyMiddleware({
        //     app,
        //     path: '/graphql'
        // });

        app.use(
            '/graphql',
            cors<cors.CorsRequest>({
                origin: ['http://localhost:3001'],
                credentials: true
            }),
            json(),
            expressMiddleware(server, {
                context: async ({ req }) => {
                    return {
                        identity: getIdentity(req.headers),
                        prisma: client
                    }
                }
            })
        )
        app.use(
            bodyParser.urlencoded({
                extended: true
            })
        )

        app.use(express.static(`${__dirname}/public`))

        // app.use('/', (req, res, next)=>{
        //     res.send('response')
        // })
        app.use(cors({
            origin : ['http://localhost:3001'],
            credentials : true
        }));

        app.post('/upload', (req, res, next) => {
            let t = getIdentity(req.headers);
            if(!t || !t.studentId){
                return res.status(403).json({
                    message : "not authenticated"
                })
            }
            console.log(t);
            const uploadFolder = path.join(path.resolve('.'), "public");
            const form = formidable({
                maxFileSize: 5 * 1024 * 1024,
                uploadDir: uploadFolder,
                allowEmptyFiles: false,
                keepExtensions : true
            });

            console.log(form);
            form.parse(req, async (err, fields, files) => {

                if (err) {
                    console.log("err==========", err)
                    return res.status(400).json({
                        message: "error__ in parsing file"
                    })
                }
                try {
                    console.log("files=================", files)
                    const file = files.file[0];
                    
                    // const fileName = encodeURIComponent(file.originalFilename.replace(/\s/g, "-"));
                    // renames the file in the directory
                    // fs.renameSync(file.filepath, path.join(uploadFolder, fileName));
                    if(Array.isArray(files.file)){
                        let r = await client.$transaction(
                            files.file.map(f =>{
                                return (
                                    client.uploadedFile.create({
                                        data : {
                                            fileName : f.originalFilename,
                                            filePath : f.filepath,
                                            studentId : t.studentId
                                        }
                                    })
                                )
                            })
                        )
                        return res.status(200).json({
                            id : r.map(s => s.uploadedFileId)
                        })
                    }
                } catch (error) {
                    console.log("err_____________", err)
                    return res.status(400).json({
                        message: "error__ in parsing file"
                    })
                }
                //   res.json({ fields, files });
            });
        });


        httpServer.listen({ port: 3000 }, () => {
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