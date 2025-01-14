import React, { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { MappingEditor } from "@/components/MappingEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, Play, Edit } from "lucide-react";
import Papa from "papaparse";

interface MappingField {
  sourceField?: string;
  destinationField: string;
  customLogic?: string;
}

export default function Index() {
  const { toast } = useToast();
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [mappingFile, setMappingFile] = useState<File | null>(null);
  const [sourceFields, setSourceFields] = useState<string[]>([]);
  const [outboundFileName, setOutboundFileName] = useState("");
  const [showMappingEditor, setShowMappingEditor] = useState(false);
  const [currentMapping, setCurrentMapping] = useState<MappingField[]>([]);

  const handleSourceFileSelect = (file: File, headers: string[]) => {
    setSourceFile(file);
    setSourceFields(headers);
    toast({
      title: "Source File Loaded",
      description: `Successfully loaded ${headers.length} fields from the source file.`,
    });
  };

  const handleMappingFileSelect = async (file: File) => {
    setMappingFile(file);
    
    Papa.parse(file, {
      complete: (results) => {
        const rows = results.data as string[][];
        if (rows.length < 2) {
          toast({
            title: "Invalid Mapping File",
            description: "The mapping file must have at least 2 rows.",
            variant: "destructive",
          });
          return;
        }

        const sourceFields = rows[0];
        const destinationFields = rows[1];
        const customLogic = rows[2] || [];

        // Create mapping only from destination fields (row 2)
        const mappingData = destinationFields
          .map((destField, index): MappingField | null => {
            if (!destField?.trim()) return null;
            
            return {
              destinationField: destField.trim(),
              sourceField: sourceFields[index]?.trim() || undefined,
              customLogic: customLogic[index]?.trim() || undefined,
            };
          })
          .filter((mapping): mapping is MappingField => mapping !== null);

        setCurrentMapping(mappingData);
        toast({
          title: "Mapping File Loaded",
          description: `Successfully loaded ${mappingData.length} field mappings.`,
        });
      },
      error: (error) => {
        toast({
          title: "Error Loading Mapping",
          description: "Failed to parse the mapping file. Please ensure it's a valid CSV.",
          variant: "destructive",
        });
      }
    });
  };

  const handleSaveMapping = (mapping: MappingField[]) => {
    setCurrentMapping(mapping);
    setShowMappingEditor(false);
    
    // Convert mapping to CSV format
    const rows: string[][] = [
      // Row 1: Source fields
      mapping.map(field => field.sourceField || ''),
      // Row 2: Destination fields
      mapping.map(field => field.destinationField),
      // Row 3: Custom logic
      mapping.map(field => field.customLogic || '')
    ];
    
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "mapping.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Mapping Saved",
      description: `Successfully saved mapping with ${mapping.length} fields.`,
    });
  };

  return (
    <div className="container mx-auto py-12 space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6 mb-16">
        <h1 className="text-5xl font-bold gradient-text tracking-tight">
          DataFlow Mapper
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform and map your data with an intuitive visual interface
        </p>
      </div>
      
      <div className="glass-card p-8 space-y-8">
        <Tabs defaultValue="upload" className="custom-tabs">
          <TabsList className="grid w-full grid-cols-2 mb-12">
            <TabsTrigger value="upload" className="custom-tab py-3">
              Use Existing Mapping
            </TabsTrigger>
            <TabsTrigger value="create" className="custom-tab py-3">
              Create New Mapping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-12">
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
                onClick={() => setShowMappingEditor(true)}
                className="enhanced-button"
                disabled={!sourceFile}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Mapping
              </Button>
              <Button 
                className="enhanced-button gradient-animate text-white"
                disabled={!sourceFile || (!mappingFile && currentMapping.length === 0)}
              >
                <Play className="h-4 w-4 mr-2" />
                Execute Mapping
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-8">
            <div className="glass-card p-8 border border-white/20">
              <MappingEditor
                sourceFields={sourceFields}
                onSave={handleSaveMapping}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showMappingEditor && (
        <div className="glass-card p-8 mt-8 hover-card">
          <MappingEditor
            sourceFields={sourceFields}
            onSave={handleSaveMapping}
            initialMapping={currentMapping}
          />
        </div>
      )}
    </div>
  );
}
