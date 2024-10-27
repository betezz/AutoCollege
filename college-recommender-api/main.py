from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path

app = FastAPI()

# Update the CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only. In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use the absolute path to the CSV file
csv_path = Path("/Users/morabp27/ColAutoOne/AutoCollege/data/scholarships.csv")

# Load scholarship data
try:
    scholarship_data = pd.read_csv(csv_path)
    # Convert only the GPA column to float
    scholarship_data['GPA'] = pd.to_numeric(scholarship_data['GPA'], errors='coerce')
    print(f"Successfully loaded {len(scholarship_data)} scholarships")
except FileNotFoundError:
    print(f"Error: CSV file not found at {csv_path}")
    scholarship_data = pd.DataFrame()

@app.get("/")
async def root():
    return {"message": "Scholarship API is running"}

@app.post("/scholarships")
async def get_scholarships(request: Request):
    try:
        student_data = await request.json()
        gpa = float(student_data.get("gpa", 0))
        major = student_data.get("major", "")

        if scholarship_data.empty:
            raise HTTPException(status_code=404, detail="No scholarship data available")

        # Debug print statements
        print(f"Student GPA: {gpa}, type: {type(gpa)}")
        print(f"First scholarship GPA: {scholarship_data['GPA'].iloc[0]}, type: {type(scholarship_data['GPA'].iloc[0])}")

        # Filter scholarships based on student inputs
        eligible_scholarships = scholarship_data[
            (scholarship_data['GPA'] <= gpa) &
            (scholarship_data['Major'].str.lower() == major.lower())
        ]

        if eligible_scholarships.empty:
            raise HTTPException(status_code=404, detail="No matching scholarships found")

        return eligible_scholarships.to_dict(orient="records")
    except Exception as e:
        print(f"Error processing request: {str(e)}")  # Add debug logging
        raise HTTPException(status_code=500, detail=str(e))

#NOTE: TO START PROGRAM: uvicorn main:app --reload
