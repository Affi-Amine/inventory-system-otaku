import { prisma } from "@/lib/db"
import { ProductList } from "@/components/dashboard/products/product-list"
import { AddProductButton } from "@/components/dashboard/products/add-product-button"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <AddProductButton />
      </div>
      <ProductList products={products} />
    </div>
  )
}

export const dynamic = "force-dynamic"

