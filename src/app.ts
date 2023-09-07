require('dotenv').config()
import "reflect-metadata";

import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { createServer } from 'http'
import { Context } from "./graphql/interface";
import { PrismaClient } from "@prisma/client";

import { loginMutationResolver} from "./graphql/resolvers/MutationResolvers/loginMutationResolver";
import { studentSeatMutationResolver } from "./graphql/resolvers/MutationResolvers/studentSeatMutationResolvers";
import { provostSeatMutationResolver} from "./graphql/resolvers/MutationResolvers/provostSeatMutationResolvers";

import { MealMutationResolvers} from "./graphql/resolvers/MutationResolvers/mess/mealMutationResolvers";
import { AnnouncementMutationResolvers } from "./graphql/resolvers/MutationResolvers/mess/announcementMutationResolvers";
import { MessManagerMutationResolvers} from "./graphql/resolvers/MutationResolvers/mess/messManagerMutationResolvers";
import { FeedbackMutationResolvers} from "./graphql/resolvers/MutationResolvers/mess/feedbackMutationResolvers";

import { basicResolver} from "./graphql/resolvers/QueryResolvers/basicResolvers";
import { seatQueryResolver } from "./graphql/resolvers/QueryResolvers/seatQueryResolvers";
import { MealQueryResolvers} from "./graphql/resolvers/QueryResolvers/mess/mealQueryResolvers";
import { AnnouncementQueryResolvers} from "./graphql/resolvers/QueryResolvers/mess/announcementQueryResolvers";
import { MessManagerQueryResolvers} from "./graphql/resolvers/QueryResolvers/mess/messManagerQueryResolvers";
import { StatsFeedbackQueryResolvers } from "./graphql/resolvers/QueryResolvers/mess/statsFeedbackQueryResolvers";

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
import {OptedOutResolver} from "./graphql/resolvers/FieldResolvers/optedOut";
import {MessManagerResolver} from "./graphql/resolvers/FieldResolvers/messManager";
import {MessManagerApplicationResolver} from "./graphql/resolvers/FieldResolvers/messManagerApplication";
import {AnnouncementResolver} from "./graphql/resolvers/FieldResolvers/announcement";
import { FeedbackWithRatingResolver } from "./graphql/resolvers/FieldResolvers/feedbackWithRating";
import { FeedbackResolver } from "./graphql/resolvers/FieldResolvers/feedback";
import { MessManagerApplicationCallResolver } from "./graphql/resolvers/FieldResolvers/messManagerApplicationCall";
import { NotificationResolver } from "./graphql/resolvers/FieldResolvers/notifications";
import { ComplaintResolver } from "./graphql/resolvers/FieldResolvers/complaint";
import { ComplaintQueryResolvers } from "./graphql/resolvers/QueryResolvers/complaintQueryResolver";


const client = new PrismaClient()

buildSchema({
    resolvers: [
        basicResolver,
        seatQueryResolver,
        MealQueryResolvers,
        AnnouncementQueryResolvers,
        MessManagerQueryResolvers,
        StatsFeedbackQueryResolvers,
        loginMutationResolver,
        studentSeatMutationResolver,
        provostSeatMutationResolver,
        MealMutationResolvers,
        AnnouncementMutationResolvers,
        MessManagerMutationResolvers,
        FeedbackMutationResolvers,
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
        PreferenceResolver,
        OptedOutResolver,
        MessManagerResolver,
        MessManagerApplicationResolver,
        AnnouncementResolver,
        FeedbackWithRatingResolver,
        FeedbackResolver,
        MessManagerApplicationCallResolver,
        NotificationResolver,
        ComplaintResolver,
        ComplaintQueryResolvers
    ],
    authChecker: authChecker
}).then(schema => {

    const app = express();
    const httpServer = createServer(app);


    const server = new ApolloServer<Context>({
        schema: schema,
        plugins: [ApolloServerPluginLandingPageLocalDefault(), {}],
    })

    server.start().then(() => {
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

        app.use(cors({
            origin : ['http://localhost:3001'],
            credentials : true
        }));

        app.use(express.static(path.join(path.resolve('.'), 'public')));


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
                                            studentId : t.studentId,
                                            newFileName : f.newFilename
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