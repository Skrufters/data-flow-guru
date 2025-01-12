import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { 
  Variable, 
  Code, 
  ArrowDown,
  WrapText,
  RotateCcw 
} from "lucide-react";

interface LogicBuilderProps {
  fieldName: string;
  onSave: (code: string) => void;
  onClose: () => void;
  initialCode?: string;
}

export function LogicBuilder({ 
  fieldName, 
  onSave, 
  onClose, 
  initialCode 
}: LogicBuilderProps) {
  const [operations, setOperations] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState(initialCode || "");

  const addOperation = (type: string) => {
    setOperations([...operations, type]);
    // In a real implementation, this would generate actual Python code
    setGeneratedCode(`def transform_field(value):\n    result = value.upper()\n    return result`);
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Custom Logic: {fieldName}
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="enhanced-button"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button 
          variant="outline" 
          onClick={() => addOperation("variable")}
          className="enhanced-button"
        >
          <Variable className="h-4 w-4 mr-2" />
          Create Variable
        </Button>
        <Button 
          variant="outline" 
          onClick={() => addOperation("if")}
          className="enhanced-button"
        >
          <ArrowDown className="h-4 w-4 mr-2" />
          If/Then
        </Button>
        <Button 
          variant="outline" 
          onClick={() => addOperation("manipulate")}
          className="enhanced-button"
        >
          <WrapText className="h-4 w-4 mr-2" />
          Manipulate
        </Button>
        <Button 
          variant="outline" 
          onClick={() => addOperation("manual")}
          className="enhanced-button"
        >
          <Code className="h-4 w-4 mr-2" />
          Manual
        </Button>
      </div>

      <div className="space-y-4 bg-white/30 backdrop-blur-sm rounded-lg p-4">
        <h4 className="font-medium">Applied Operations</h4>
        <div className="space-y-2">
          {operations.map((op, i) => (
            <div key={i} className="text-sm text-muted-foreground">
              • {op} operation applied
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Generated Python Code</h4>
        <pre className="code-preview">
          {generatedCode}
        </pre>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="enhanced-button"
        >
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(generatedCode)}
          className="enhanced-button bg-gradient-to-r from-primary to-primary/90"
        >
          Save Logic
        </Button>
      </div>
    </div>
  );
}