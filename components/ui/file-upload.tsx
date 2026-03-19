"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  onChange: (files: File[]) => void
  maxFiles?: number
  accept?: string
  maxSize?: number
}

export function FileUpload({ 
  onChange, 
  maxFiles = 5, 
  accept = "image/*",
  maxSize = 10
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Можно загрузить не более ${maxFiles} файлов`)
      return
    }

    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Файл ${file.name} больше ${maxSize}MB`)
        return false
      }
      return true
    })

    const newFiles = [...files, ...validFiles]
    setFiles(newFiles)
    onChange(newFiles)

    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    URL.revokeObjectURL(previews[index])
    
    setFiles(newFiles)
    setPreviews(newPreviews)
    onChange(newFiles)
  }

  return (
    <div className="space-y-4">
      <div
        className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/30 hover:bg-muted/50"
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <Upload className="h-5 w-5" />
          <span className="text-xs">Нажмите для загрузки</span>
          <span className="text-xs text-muted-foreground/70">
            {maxFiles} файлов, до {maxSize}MB каждый
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative aspect-square">
              <Image
                src={preview}
                alt={`preview-${idx}`}
                fill
                className="rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}