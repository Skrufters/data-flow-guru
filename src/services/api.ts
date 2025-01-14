import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const transformData = async (
  sourceFile: File,
  mappingFile: File,
  outputFileName: string,
  dateTransformations?: Record<string, [string, string]>,
  valueReplacements?: Record<string, Record<string, string>>
) => {
  const formData = new FormData();
  formData.append("source_file", sourceFile);
  formData.append("mapping_file", mappingFile);
  formData.append("output_file", outputFileName);
  
  if (dateTransformations) {
    formData.append("date_transformations", JSON.stringify(dateTransformations));
  }
  if (valueReplacements) {
    formData.append("value_replacements", JSON.stringify(valueReplacements));
  }

  const response = await api.post("/transform", formData);
  return response.data;
};

export const parseSourceFields = async (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/parse-source-fields", formData);
  return response.data.fields;
};

export const parseMappingFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/parse-mapping", formData);
  return response.data;
};