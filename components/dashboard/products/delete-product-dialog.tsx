'use client'

import { useState } from "react"
import { deleteProduct } from "@/app/actions/products"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteProductDialogProps {
  productId: string
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

export function DeleteProductDialog({
  productId,
  isOpen,
  onClose,
  onDelete,
}: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deleteProduct(productId)
      if (result.success) {
        onDelete()
      } else {
        console.error('Failed to delete product:', result.error)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}