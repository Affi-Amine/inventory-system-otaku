"use client"

import { useState, type MouseEvent } from "react"
import { useRouter } from "next/navigation"
import type { Customer } from "@prisma/client"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog"
import { DropdownMenuItem } from "../../ui/dropdown-menu"
import React from "react"

interface DeleteCustomerDialogProps {
  customer: Customer
  onDelete: (customer: Customer) => void
}

export function DeleteCustomerDialog({ customer, onDelete }: DeleteCustomerDialogProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const router = useRouter()

  async function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete customer")
      }

      onDelete(customer)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting customer:", error)
      setError(error instanceof Error ? error.message : "Failed to delete customer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
          className="text-red-600"
        >
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {customer.name}? This action cannot be undone.
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}