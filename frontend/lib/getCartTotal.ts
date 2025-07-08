import { ProductContent } from "@/typings/productTypings";


export function getCartTotal(products: ProductContent[]): string {
  const total = products.reduce(
    (accumulator: number, currentProduct: ProductContent) => accumulator+ currentProduct.content.price, 0
    
  )
  return `${products[0]?.content.currency ? products[0]?.content.currency : "USD"} ${total.toFixed(2)}`
}

