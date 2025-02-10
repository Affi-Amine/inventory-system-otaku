"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import React from "react"
import { Button } from "../../ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import { ImageUpload } from "./image-upload"

export function AddProductButton() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const router = useRouter()
  
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setLoading(true)
  
      try {
        const formData = new FormData(e.currentTarget)
        const response = await fetch("/api/products", {
          method: "POST",
          body: JSON.stringify({
            name: formData.get("name"),
            description: formData.get("description"),
            price: Number.parseFloat(formData.get("price") as string),
            stock: Number.parseInt(formData.get("stock") as string),
            sku: formData.get("sku"),
            category: formData.get("category"),
            imageUrl: imageUrl, // Add the image URL
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        if (!response.ok) {
          throw new Error("Failed to create product")
        }
  
        setOpen(false)
        router.refresh()
      } catch (error) {
        console.error("Error creating product:", error)
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Product Image</Label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" disabled={loading} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" step="0.01" min="0" required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" min="0" required disabled={loading} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" required disabled={loading} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  