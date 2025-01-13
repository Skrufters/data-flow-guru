import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File, headers?: string[]) => void;
  accept?: Record<string, string[]>;
  label: string;
}

export function FileUpload({ onFileSelect, accept, label }: FileUploadProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    return new Promise<string[]>((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          if (results.data && Array.isArray(results.data) && results.data.length > 0) {
            const headers = results.data[0] as string[];
            resolve(headers);
          } else {
            reject(new Error("No data found in CSV"));
          }
        },
        error: (error) => {
          reject(error);
        },
        header: false
      });
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setSelectedFile(file);
      const headers = await processFile(file);
      onFileSelect(file, headers);
      toast({
        title: "File uploaded successfully",
        description: `Found ${headers.length} columns in the CSV file.`,
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Please ensure it's a valid CSV file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onFileSelect, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1
  });

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "drop-zone cursor-pointer group h-32",
        isDragActive && "active",
        isProcessing && "opacity-50 cursor-wait"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
          <Upload className="h-4 w-4 text-primary" />
        </div>
        {selectedFile ? (
          <div className="text-sm">
            <span className="font-medium text-primary">{selectedFile.name}</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {isDragActive ? (
              <span className="text-primary font-medium">Drop the file here</span>
            ) : isProcessing ? (
              "Processing file..."
            ) : (
              label
            )}
          </p>
        )}
        <Button 
          variant="outline" 
          size="sm"
          disabled={isProcessing}
          className="enhanced-button bg-white/50 backdrop-blur-sm text-xs"
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
}