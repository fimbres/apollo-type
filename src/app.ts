import 'reflect-metadata'
import dotenv from 'dotenv'
import express from 'express'
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core';

import { resolvers } from './resolvers';
import { connectToMongo } from './utils/database';
import { verify } from 'jsonwebtoken';
import { verifyJwt } from './utils/jwt';
import { User } from './schema/user.schema';
import Context from './types/context';

dotenv.config();

async function bootstrap() {
    const app = express();

    const schema = await buildSchema({
        resolvers,
        // authChecker,
    });

    const server = new ApolloServer({
        schema,
        context: (ctx: Context) => {
            const context = ctx;
            if(ctx.req.cookies.accessToken) {
                const user = verifyJwt<User>(ctx.req.cookies.accessToken);
                context.user = user;
            }

            return context;
        },
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
