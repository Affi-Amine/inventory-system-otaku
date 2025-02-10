"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@prisma/client"
import React from "react"
import { Button } from "../../ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { DropdownMenuItem } from "../../ui/dropdown-menu"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import { ImageUpload } from "./image-upload"

interface EditProductDialogProps {
    product: Product
    onUpdate: (product: Product) => void
  }
  
  export function EditProductDialog({ product, onUpdate }: EditProductDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState(product.imageUrl || "")
    const router = useRouter()
  
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setLoading(true)
  
      try {
        const formData = new FormData(e.currentTarget)
        const response = await fetch(`/api/products/${product.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: formData.get("name"),
            description: formData.get("description"),
            price: Number.parseFloat(formData.get("price") as string),
            stock: Number.parseInt(formData.get("stock") as string),
            sku: formData.get("sku"),
            category: formData.get("category"),
            imageUrl: imageUrl,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        if (!response.ok) {
          throw new Error("Failed to update product")
        }
  
        const updated = await response.json()
        onUpdate(updated)
        setOpen(false)
        router.refresh()
      } catch (error) {
        console.error("Error updating product:", error)
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Product Image</Label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={product.name} required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={product.description || ""} disabled={loading} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product.price}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={product.stock}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" defaultValue={product.sku} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={product.category} required disabled={loading} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  