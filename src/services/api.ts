import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const transformData = async (
  sourceFile: File,
  mappingFile: File,
  outputFileName: string,
) => {
  const formData = new FormData();
  formData.append("source_file", sourceFile);
  formData.append("mapping_file", mappingFile);

  const response = await api.post("/transform", formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // Create a download link for the transformed file
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', outputFileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return response.data;
};

export const parseSourceFields = async (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/parse-source-fields", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.fields;
};

export const parseMappingFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/parse-mapping", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return {
    sourceFields: response.data.source_fields || [],
    destinationFields: response.data.destination_fields || [],
    customLogic: response.data.custom_logic || [],
  };
};