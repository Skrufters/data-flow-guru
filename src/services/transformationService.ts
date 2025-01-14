import { toast } from "sonner";

interface TransformationResponse {
  success: boolean;
  message: string;
  outputFile?: string;
}

export interface DateTransformation {
  [field: string]: [string, string]; // [inputFormat, outputFormat]
}

export interface ValueReplacements {
  [field: string]: {
    [key: string]: string;
  };
}

export const transformData = async (
  sourceFile: File,
  mappingFile: File,
  outputFileName: string,
  dateTransformations?: DateTransformation,
  valueReplacements?: ValueReplacements
): Promise<TransformationResponse> => {
  const formData = new FormData();
  formData.append("sourceFile", sourceFile);
  formData.append("mappingFile", mappingFile);
  formData.append("outputFileName", outputFileName);
  
  if (dateTransformations) {
    formData.append("dateTransformations", JSON.stringify(dateTransformations));
  }
  
  if (valueReplacements) {
    formData.append("valueReplacements", JSON.stringify(valueReplacements));
  }

  try {
    const response = await fetch("/api/transform", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Transformation failed");
    }

    return data;
  } catch (error) {
    console.error("Transformation error:", error);
    toast.error("Failed to transform data");
    throw error;
  }
};

export const parseSourceFields = async (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/parse-source-fields", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to parse source fields");
    }

    const data = await response.json();
    return data.fields;
  } catch (error) {
    console.error("Error parsing source fields:", error);
    toast.error("Failed to parse source fields");
    throw error;
  }
};

export const parseMappingFile = async (file: File): Promise<{
  sourceFields: string[];
  destinationFields: string[];
  customLogic: string[];
}> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/parse-mapping", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to parse mapping file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error parsing mapping file:", error);
    toast.error("Failed to parse mapping file");
    throw error;
  }
};