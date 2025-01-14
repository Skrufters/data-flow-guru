import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, Code } from "lucide-react";
import { LogicBuilder } from "./LogicBuilder";
import { useToast } from "@/hooks/use-toast";

interface MappingField {
  sourceField?: string;
  destinationField: string;
  customLogic?: string;
}

interface MappingEditorProps {
  sourceFields: string[];
  onSave: (mapping: MappingField[]) => void;
  initialMapping?: MappingField[];
}

export function MappingEditor({ sourceFields, onSave, initialMapping }: MappingEditorProps) {
  const [fields, setFields] = useState<MappingField[]>([]);
  const [activeLogicField, setActiveLogicField] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialMapping && initialMapping.length > 0) {
      setFields(initialMapping);
    }
  }, [initialMapping]);

  const addField = () => {
    setFields([...fields, { destinationField: "" }]);
  };

  const updateField = (index: number, updates: Partial<MappingField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const handleLogicSave = (index: number, code: string) => {
    updateField(index, { customLogic: code });
    setActiveLogicField(null);
    toast({
      title: "Custom Logic Saved",
      description: "Your transformation logic has been updated.",
    });
  };

  const validateMapping = () => {
    const errors = [];
    
    for (const field of fields) {
      if (!field.destinationField) {
        errors.push("All destination fields must be named");
      }
    }

    return errors;
  };

  const handleSave = () => {
    const errors = validateMapping();
    if (errors.length > 0) {
      toast({
        title: "Invalid Mapping",
        description: errors[0],
        variant: "destructive",
      });
      return;
    }

    onSave(fields);
    toast({
      title: "Mapping Saved",
      description: `Successfully saved mapping with ${fields.length} fields.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-[200px_1fr] gap-8">
          <div className="space-y-[4.5rem] pt-14">
            <div className="font-medium text-sm text-muted-foreground">Source Field</div>
            <div className="font-medium text-sm text-muted-foreground">Destination Field</div>
            <div className="font-medium text-sm text-muted-foreground">Custom Logic</div>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex space-x-8 p-4">
              {fields.map((field, index) => (
                <div key={index} className="flex-none w-[280px] space-y-6">
                  <Select
                    value={field.sourceField || "none"}
                    onValueChange={(value) => updateField(index, { 
                      sourceField: value === "none" ? undefined : value 
                    })}
                  >
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Select source field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {sourceFields.map((sf) => (
                        <SelectItem key={sf} value={sf}>
                          {sf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Destination field"
                    value={field.destinationField}
                    onChange={(e) => 
                      updateField(index, { destinationField: e.target.value })
                    }
                    className="bg-white/50"
                  />

                  <div className="min-h-[80px]">
                    {!field.sourceField && !field.customLogic && (
                      <Button
                        variant="outline"
                        className="w-full enhanced-button"
                        onClick={() => setActiveLogicField(index)}
                      >
                        <Code className="h-4 w-4 mr-2" />
                        Add Custom Logic
                      </Button>
                    )}

                    {field.customLogic && (
                      <div className="relative bg-white/80 rounded-md p-3">
                        <pre className="text-xs max-h-20 overflow-y-auto font-mono">
                          {field.customLogic}
                        </pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() => setActiveLogicField(index)}
                        >
                          <Code className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button 
          onClick={addField}
          variant="outline"
          className="enhanced-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>

        <Button 
          onClick={handleSave}
          className="enhanced-button bg-gradient-to-r from-primary to-primary/90"
        >
          Save Mapping
        </Button>
      </div>

      {activeLogicField !== null && (
        <LogicBuilder
          fieldName={fields[activeLogicField]?.destinationField || ""}
          onSave={(code) => handleLogicSave(activeLogicField, code)}
          onClose={() => setActiveLogicField(null)}
          initialCode={fields[activeLogicField]?.customLogic}
        />
      )}
    </div>
  );
}