import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Plus, Code } from "lucide-react";
import { LogicBuilder } from "./LogicBuilder";

interface MappingField {
  sourceField?: string;
  destinationField: string;
  customLogic?: string;
}

interface MappingEditorProps {
  sourceFields: string[];
  onSave: (mapping: MappingField[]) => void;
}

export function MappingEditor({ sourceFields, onSave }: MappingEditorProps) {
  const [fields, setFields] = useState<MappingField[]>([]);
  const [activeLogicField, setActiveLogicField] = useState<number | null>(null);

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
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fields.map((field, index) => (
          <div key={index} className="space-y-4">
            <Select
              value={field.sourceField}
              onValueChange={(value) => updateField(index, { sourceField: value })}
            >
              <SelectTrigger>
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
            />

            {!field.sourceField && (
              <Button
                variant="outline"
                className="w-full"
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

      <Button onClick={addField} className="mt-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Field
      </Button>

      {activeLogicField !== null && (
        <LogicBuilder
          fieldName={fields[activeLogicField]?.destinationField || ""}
          onSave={(code) => handleLogicSave(activeLogicField, code)}
          onClose={() => setActiveLogicField(null)}
          initialCode={fields[activeLogicField]?.customLogic}
        />
      )}

      <div className="flex justify-end">
        <Button onClick={() => onSave(fields)}>
          Save Mapping
        </Button>
      </div>
    </div>
  );
}