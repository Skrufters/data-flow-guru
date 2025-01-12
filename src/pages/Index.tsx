import React, { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { MappingEditor } from "@/components/MappingEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Download, Play, Edit } from "lucide-react";

export default function Index() {
  const { toast } = useToast();
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [mappingFile, setMappingFile] = useState<File | null>(null);
  const [outboundFileName, setOutboundFileName] = useState("");
  const [showMappingEditor, setShowMappingEditor] = useState(false);
  
  // Mock source fields - in reality, these would come from parsing the source file
  const sourceFields = ["field1", "field2", "field3", "field4", "field5"];

  const handleExecuteMapping = async () => {
    // Here you would call your Python transform function
    toast({
      title: "Transformation Complete",
      description: "Your file has been processed successfully.",
    });
  };

  const handleSaveMapping = async (mapping: any) => {
    // Here you would save the mapping to a CSV file
    toast({
      title: "Mapping Saved",
      description: "Your mapping configuration has been saved successfully.",
    });
    setShowMappingEditor(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">DataFlow Mapper</h1>
      
      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Use Existing Mapping</TabsTrigger>
          <TabsTrigger value="create">Create New Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Source File (CSV)</label>
              <FileUpload
                onFileSelect={setSourceFile}
                accept={{ "text/csv": [".csv"] }}
                label="Upload source CSV file"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mapping File (CSV)</label>
              <FileUpload
                onFileSelect={setMappingFile}
                accept={{ "text/csv": [".csv"] }}
                label="Upload mapping CSV file"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Outbound File Name</label>
              <Input
                placeholder="Enter file name"
                value={outboundFileName}
                onChange={(e) => setOutboundFileName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleExecuteMapping}>
              <Play className="h-4 w-4 mr-2" />
              Execute Mapping
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowMappingEditor(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Mapping
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Mapping
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <MappingEditor
            sourceFields={sourceFields}
            onSave={handleSaveMapping}
          />
        </TabsContent>
      </Tabs>

      {showMappingEditor && (
        <MappingEditor
          sourceFields={sourceFields}
          onSave={handleSaveMapping}
        />
      )}
    </div>
  );
}