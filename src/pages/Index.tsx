import React, { useState } from "react";
import { TransformationForm } from "@/components/TransformationForm";
import { MappingEditor } from "@/components/MappingEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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

  const handleMappingFileSelect = (mapping: any) => {
    setMappingFile(mapping.file);
    const mappingData = mapping.destinationFields
      .map((destField: string, index: number): MappingField | null => {
        if (!destField?.trim()) return null;
        
        return {
          destinationField: destField.trim(),
          sourceField: mapping.sourceFields[index]?.trim() || undefined,
          customLogic: mapping.customLogic[index]?.trim() || undefined,
        };
      })
      .filter((mapping: MappingField | null): mapping is MappingField => mapping !== null);

    setCurrentMapping(mappingData);
    toast({
      title: "Mapping File Loaded",
      description: `Successfully loaded ${mappingData.length} field mappings.`,
    });
  };

  const handleSaveMapping = (mapping: MappingField[]) => {
    setCurrentMapping(mapping);
    setShowMappingEditor(false);
    
    // Convert mapping to CSV format for the Python backend
    const rows = [
      mapping.map(field => field.sourceField || ''),
      mapping.map(field => field.destinationField),
      mapping.map(field => field.customLogic || '')
    ];
    
    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const file = new File([blob], "mapping.csv", { type: "text/csv" });
    setMappingFile(file);

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

          <TabsContent value="upload">
            <TransformationForm
              onSourceFileSelect={handleSourceFileSelect}
              onMappingFileSelect={handleMappingFileSelect}
              onShowEditor={() => setShowMappingEditor(true)}
              sourceFile={sourceFile}
              mappingFile={mappingFile}
              currentMapping={currentMapping}
            />
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