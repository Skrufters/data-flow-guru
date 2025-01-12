import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  label: string;
}

export function FileUpload({ onFileSelect, accept, label }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1
  });

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "drop-zone cursor-pointer",
        isDragActive && "active"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-8 w-8 text-primary" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? "Drop the file here" : label}
        </p>
        <Button variant="outline" size="sm">
          Browse Files
        </Button>
      </div>
    </div>
  );
}