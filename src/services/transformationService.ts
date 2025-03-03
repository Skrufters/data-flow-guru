import { toast } from "sonner";
import { api, transformData as apiTransformData, parseSourceFields as apiParseSourceFields, parseMappingFile as apiParseMappingFile } from "./api";

export interface DateTransformation {
  [field: string]: [string, string];
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
) => {
  try {
    await apiTransformData(
      sourceFile,
      mappingFile,
      outputFileName,
      dateTransformations,
      valueReplacements
    );
    toast.success("Data transformation completed successfully");
  } catch (error) {
    console.error("Transformation error:", error);
    toast.error("Failed to transform data. Please check the console for details.");
    throw error;
  }
};

export const parseSourceFields = async (file: File): Promise<string[]> => {
  try {
    return await apiParseSourceFields(file);
  } catch (error) {
    console.error("Error parsing source fields:", error);
    toast.error("Failed to parse source fields. Please check the file format.");
    throw error;
  }
};

export const parseMappingFile = async (file: File) => {
  try {
    const result = await apiParseMappingFile(file);
    return {
      file,
      sourceFields: result.sourceFields,
      destinationFields: result.destinationFields,
      customLogic: result.customLogic,
    };
  } catch (error) {
    console.error("Error parsing mapping file:", error);
    toast.error("Failed to parse mapping file. Please check the file format.");
    throw error;
  }
};