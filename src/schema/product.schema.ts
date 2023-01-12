import { ObjectType, Field, InputType } from "type-graphql"
import { prop, Ref, index, getModelForClass } from "@typegoose/typegoose"
import { User } from "./user.schema";
import * as nanoid from 'nanoid';
import { MaxLength, MinLength, IsNumber } from "class-validator"

const nanoID = nanoid.customAlphabet('abcdefghijklmnopqrstuvxyz1234567890', 10);

@ObjectType()
@index({ productId: 1 })
export class Product {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    @prop({required: true, ref: () => User})
    user: Ref<User>;

    @Field(() => String)
    @prop({required: true})
    name: string;

    @Field(() => String)
    @prop({required: true})
    description: string;

    @Field(() => Number)
    @prop({required: true})
    price: number;

    @Field(() => String)
    @prop({required: true, default: () => `product_${nanoID()}`})
    productId: string;
}

export const ProductModel = getModelForClass<typeof Product>(Product);

@InputType()
export class CreateProductInput {
    @Field()
    name: string;

    @MinLength(50, {
        message: "Description must be at least 10 characters long"
    })
    @MaxLength(50, {
        message: "Description must be at least 10 characters long"
    })
    @Field()
    description: string;

    @IsNumber()
    @Field()
    price: number;
}

@InputType()
export class GetProductInput {
    @Field()
    productId: string;
}
