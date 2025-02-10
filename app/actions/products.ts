'use server'

import { prisma } from "../../lib/db"
import { revalidatePath } from "next/cache"

export async function deleteProduct(productId: string) {
  try {
    const product = await prisma.product.delete({
      where: { id: productId },
    })
    
    revalidatePath('/dashboard/products')
    return { success: true, product }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete product" 
    }
  }
}