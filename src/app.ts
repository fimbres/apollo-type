import 'reflect-metadata'
import dotenv from 'dotenv'
import express from 'express'
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core';

import { resolvers } from './resolvers';
import { connectToMongo } from './utils/database';

dotenv.config();

async function bootstrap() {
    const app = express();

    const schema = await buildSchema({
        resolvers,
        // authChecker,
    });

    const server = new ApolloServer({
        schema,
        plugins: [
            process.env.NODE_ENV === 'production' ? 
            ApolloServerPluginLandingPageProductionDefault() : 
            ApolloServerPluginLandingPageGraphQLPlayground()
        ]
    });

    await server.start();

    app.use(cookieParser());

    server.applyMiddleware({ app });

    connectToMongo();

    app.listen({ port: process.env.PORT || 4000 }, () => {
        console.log("App is listening on port 4000");
    });

}

bootstrap();
