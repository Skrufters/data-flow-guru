import React, { useState } from "react";
import { FileUpload } from "./FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Play, Edit } from "lucide-react";
import { transformData, parseSourceFields, parseMappingFile } from "@/services/transformationService";

interface TransformationFormProps {
  onSourceFileSelect: (file: File, headers: string[]) => void;
  onMappingFileSelect: (mapping: any) => void;
  onShowEditor: () => void;
  sourceFile: File | null;
  mappingFile: File | null;
  currentMapping: any[];
}

export function TransformationForm({
  onSourceFileSelect,
  onMappingFileSelect,
  onShowEditor,
  sourceFile,
  mappingFile,
  currentMapping
}: TransformationFormProps) {
  const { toast } = useToast();
  const [outboundFileName, setOutboundFileName] = useState("");
  const [isTransforming, setIsTransforming] = useState(false);

  const handleSourceFileSelect = async (file: File) => {
    try {
      const headers = await parseSourceFields(file);
      onSourceFileSelect(file, headers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse source file",
        variant: "destructive",
      });
    }
  };

  const handleMappingFileSelect = async (file: File) => {
    try {
      const mapping = await parseMappingFile(file);
      onMappingFileSelect(mapping);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse mapping file",
        variant: "destructive",
      });
    }
  };

  const handleTransform = async () => {
    if (!sourceFile || (!mappingFile && currentMapping.length === 0)) {
      toast({
        title: "Error",
        description: "Please provide both source and mapping files",
        variant: "destructive",
      });
      return;
    }

    setIsTransforming(true);
    try {
      await transformData(
        sourceFile,
        mappingFile!,
        outboundFileName || "transformed.csv"
      );
      toast({
        title: "Success",
        description: "Data transformation completed",
      });
    } catch (error) {
      // Error already handled in service
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <label className="text-sm font-medium text-muted-foreground">
            Source File (CSV)
          </label>
          <FileUpload
            onFileSelect={handleSourceFileSelect}
            accept={{ "text/csv": [".csv"] }}
            label="Upload source CSV file"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-muted-foreground">
            Mapping File (CSV)
          </label>
          <FileUpload
            onFileSelect={handleMappingFileSelect}
            accept={{ "text/csv": [".csv"] }}
            label="Upload mapping CSV file"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-muted-foreground">
            Outbound File Name
          </label>
          <Input
            placeholder="Enter file name"
            value={outboundFileName}
            onChange={(e) => setOutboundFileName(e.target.value)}
            className="enhanced-input"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-end">
        <Button 
          variant="outline" 
          onClick={onShowEditor}
          className="enhanced-button"
          disabled={!sourceFile}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Mapping
        </Button>
        <Button 
          className="enhanced-button gradient-animate text-white"
          disabled={!sourceFile || (!mappingFile && currentMapping.length === 0) || isTransforming}
          onClick={handleTransform}
        >
          <Play className="h-4 w-4 mr-2" />
          {isTransforming ? "Processing..." : "Execute Mapping"}
        </Button>
      </div>
    </div>
  );
}