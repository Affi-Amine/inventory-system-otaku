"use client"

import { useState, useRef } from "react"
import { Button } from "../../ui/button"
import { ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import React from "react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-40 h-40 rounded-lg border overflow-hidden">
        {value ? (
          <Image src={value || "/placeholder.svg"} alt="Product image" fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
        <Button type="button" variant="outline" onClick={handleClick} disabled={disabled || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              {value ? "Change Image" : "Upload Image"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

