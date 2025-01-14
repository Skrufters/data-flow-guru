from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from typing import List, Dict, Any
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/parse-source-fields")
async def parse_source_fields(file: UploadFile = File(...)) -> Dict[str, List[str]]:
    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode('utf-8')))
    return {"fields": df.columns.tolist()}

@app.post("/parse-mapping")
async def parse_mapping(file: UploadFile = File(...)) -> Dict[str, List[str]]:
    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode('utf-8')))
    
    # Only use row 2 (index 1) for destination fields
    return {
        "source_fields": df.iloc[0].tolist() if not df.empty else [],
        "destination_fields": df.iloc[1].tolist() if len(df.index) > 1 else [],
        "custom_logic": df.iloc[2].tolist() if len(df.index) > 2 else []
    }

@app.post("/transform")
async def transform(
    source_file: UploadFile = File(...),
    mapping_file: UploadFile = File(...),
) -> Any:
    # Read source file
    source_content = await source_file.read()
    source_df = pd.read_csv(io.StringIO(source_content.decode('utf-8')))
    
    # Read mapping file
    mapping_content = await mapping_file.read()
    mapping_df = pd.read_csv(io.StringIO(mapping_content.decode('utf-8')))
    
    # Get mapping information
    source_fields = mapping_df.iloc[0].tolist()
    destination_fields = mapping_df.iloc[1].tolist()
    custom_logic = mapping_df.iloc[2].tolist() if len(mapping_df.index) > 2 else []
    
    # Create new dataframe with mapped fields
    result_df = pd.DataFrame()
    
    for i, dest_field in enumerate(destination_fields):
        if pd.notna(dest_field) and pd.notna(source_fields[i]):
            if source_fields[i] in source_df.columns:
                result_df[dest_field] = source_df[source_fields[i]]
    
    # Convert to CSV
    output = io.StringIO()
    result_df.to_csv(output, index=False)
    return output.getvalue()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)