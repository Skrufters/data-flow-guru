import React, { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { MappingEditor } from "@/components/MappingEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Download, Play, Edit, Wand2 } from "lucide-react";

export default function Index() {
  const { toast } = useToast();
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [mappingFile, setMappingFile] = useState<File | null>(null);
  const [outboundFileName, setOutboundFileName] = useState("");
  const [showMappingEditor, setShowMappingEditor] = useState(false);
  
  // Mock source fields - in reality, these would come from parsing the source file
  const sourceFields = ["field1", "field2", "field3", "field4", "field5"];

  const handleExecuteMapping = async () => {
    toast({
      title: "Transformation Complete",
      description: "Your file has been processed successfully.",
    });
  };

  const handleSaveMapping = async (mapping: any) => {
    toast({
      title: "Mapping Saved",
      description: "Your mapping configuration has been saved successfully.",
    });
    setShowMappingEditor(false);
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
                  onFileSelect={setSourceFile}
                  accept={{ "text/csv": [".csv"] }}
                  label="Upload source CSV file"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Mapping File (CSV)
                </label>
                <FileUpload
                  onFileSelect={setMappingFile}
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
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Mapping
              </Button>
              <Button 
                variant="outline"
                className="enhanced-button"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Mapping
              </Button>
              <Button 
                onClick={handleExecuteMapping}
                className="enhanced-button gradient-animate text-white"
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
          />
        </div>
      )}
    </div>
  );
}