import { ApolloError } from "apollo-server";
import bcrypt from "bcrypt";

import { LoginInput, UserModel } from "../schema/user.schema";
import Context from "../types/context";
import { signJwt } from "../utils/jwt";

class UserService {
    async createUser(input: any) {
        return UserModel.create(input);
    }

    async login (input: LoginInput, context: Context){
        const user = await UserModel.find().findByEmail(input.email).lean();
        
        if(!user) {
            throw new ApolloError('Invalid email');
        }

        const passwordIsValid = await bcrypt.compare(input.password, user.password);

        if(!passwordIsValid) {
            throw new ApolloError('Invalid password');
        }

        const token = signJwt(user);

        context.res.cookie("accessToken", token, {
            maxAge: 3.154e10,
            path: "/",
            secure: process.env.NODE_ENV === "production"
        })

        return token;
    }
}

export default UserService;