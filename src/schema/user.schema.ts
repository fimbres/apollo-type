import { Field, ObjectType, InputType } from "type-graphql";
import { prop, getModelForClass, pre, queryMethod, ReturnModelType, index } from "@typegoose/typegoose";
import { IsEmail, MinLength, MaxLength } from "class-validator"
import bcrypt from "bcrypt"
import { AsQueryMethod } from "@typegoose/typegoose/lib/types"

function findByEmail (this: ReturnModelType<typeof User, QueryHelpers>, email: User["email"]) {
    return this.findOne({ email });
}

interface QueryHelpers {
    findByEmail: AsQueryMethod<typeof findByEmail>
}

@pre<User>('save', async function () {
    if(!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hashSync(this.password, salt);
    
    this.password = hash;
})

@index({ email: 1 })
@queryMethod(findByEmail)
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

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User);

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

@InputType()
export class LoginInput {
    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;
}
