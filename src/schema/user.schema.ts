import { Field, ObjectType, InputType } from "type-graphql";
import { prop, getModelForClass,  } from "@typegoose/typegoose";
import { IsEmail, MinLength, MaxLength } from "class-validator"

@ObjectType()
export class User {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    @prop({ required: true })
    name: string

    @Field(() => String)
    @prop({ required: true })
    email: string

    @Field(() => String)
    @prop({ required: true })
    password: string
}

export const UserModel = getModelForClass(User);

@InputType()
export class CreateUserInput {
    @Field(() => String)
    name: string

    @IsEmail()
    @Field(() => String)
    email: string

    @MinLength(6, {
        message: 'password is too short, at least it must be 6 characters long'
    })
    @MaxLength(50, {
        message: 'password is too long, must not be longer than 50 characters'
    })
    @Field(() => String)
    password: string
}
