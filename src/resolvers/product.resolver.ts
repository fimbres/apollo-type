import { Resolver, Mutation, Arg, Ctx, Authorized, Query } from "type-graphql"
import ProductService from "../services/product.service";
import { CreateProductInput, GetProductInput, Product } from "../schema/product.schema";
import Context from "../types/context";

@Resolver()
export default class ProductResolver {
    constructor(private productService: ProductService) {
        this.productService = new ProductService();
    }

    @Authorized()
    @Mutation(() => Product)
    createProduct(@Arg('input') input: CreateProductInput, @Ctx() context: Context){
        const user = context.user!;
        return this.productService.createProduct({ ...input, user: user?._id });
    }

    @Query(() => [Product])
    products() {
        return this.productService.findProducts();
    }

    @Query(() => Product)
    getProductById(@Arg('input') input: GetProductInput) {
        return this.productService.findProductById({ productId: input.productId });
    }
}
