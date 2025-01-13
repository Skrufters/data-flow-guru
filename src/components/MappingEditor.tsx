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
import { Plus, Code, Download } from "lucide-react";
import { LogicBuilder } from "./LogicBuilder";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";

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
      if (!field.sourceField && !field.customLogic) {
        errors.push("Fields must have either a source field or custom logic");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fields.map((field, index) => (
          <div key={index} className="field-column space-y-4">
            <Select
              value={field.sourceField}
              onValueChange={(value) => updateField(index, { sourceField: value })}
            >
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="Select source field" />
              </SelectTrigger>
              <SelectContent>
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

            {!field.sourceField && (
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
              <pre className="code-preview text-xs">
                {field.customLogic}
              </pre>
            )}
          </div>
        ))}
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