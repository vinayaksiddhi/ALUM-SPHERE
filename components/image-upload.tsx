"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  fallback?: string
}

export function ImageUpload({ value, onChange, fallback = "U" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
      onChange(data.publicUrl)
      toast.success("Photo uploaded successfully")
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Failed to upload image. Make sure the 'avatars' bucket exists and is public in Supabase.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Avatar className="w-24 h-24 ring-4 ring-primary/20">
        <AvatarImage src={value || ""} className="object-cover" />
        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
          {fallback.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <Button
        type="button"
        variant="outline"
        className="gap-2 bg-transparent"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isUploading ? "Uploading..." : "Upload Photo"}
      </Button>
    </div>
  )
}
