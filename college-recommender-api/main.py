from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_methods=["*"],
    allow_headers=["*"],
)

# Construct the path to the CSV file
current_file = Path(__file__)
project_root = current_file.parent.parent
csv_path = project_root / "data" / "scholarships.csv"

# Load scholarship data
scholarship_data = pd.read_csv(csv_path)

@app.post("/scholarships")
async def get_scholarships(request: Request):
    student_data = await request.json()
    gpa = student_data.get("gpa", 0)
    major = student_data.get("major", "")

    # Filter scholarships based on student inputs
    eligible_scholarships = scholarship_data[
        (scholarship_data["GPA"] <= gpa) &
        (scholarship_data["Major"] == major)
    ]

    if eligible_scholarships.empty:
        raise HTTPException(status_code=404, detail="No scholarships found")

    return eligible_scholarships.to_dict(orient="records")
