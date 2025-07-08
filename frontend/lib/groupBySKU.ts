import { ProductContent } from "@/typings/productTypings";

export function groupBySKU(products: ProductContent[]):Record<string, ProductContent[]> {

    return products?.reduce(
        (accumulator: Record<string, ProductContent[]>, currentProduct: ProductContent) => {
            const sku = currentProduct.content.meta.sku;
            if (!accumulator[sku]) {
                accumulator[sku] = [];
            }
            accumulator[sku].push(currentProduct);
            return accumulator;
        },{}
    )
    
  
}

