from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import zipfile
import traceback
import sys


from routine_generator import generate_routine

app = FastAPI(debug=True)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

@app.get("/")
def health_check():
    return {"status": "Python routine backend running"}

@app.post("/generate-routine")
async def generate_routine_api(
    teachers_file: UploadFile = File(...),
    classes_file: UploadFile = File(...)
):
    print("\n" + "="*50)
    print("DEBUG: Received /generate-routine request")
    print(f"Teachers file: {teachers_file.filename}, size: {teachers_file.size}")
    print(f"Classes file: {classes_file.filename}, size: {classes_file.size}")
    try:
        # -------- Validate file types -------- #
        if not teachers_file.filename.endswith(".xlsx") or not classes_file.filename.endswith(".xlsx"):
            raise HTTPException(status_code=400, detail="Only .xlsx files allowed")

        # -------- Create unique job ID -------- #
        job_id = str(uuid.uuid4())

        job_upload_dir = os.path.join(UPLOAD_DIR, job_id)
        job_output_dir = os.path.join(OUTPUT_DIR, job_id)

        os.makedirs(job_upload_dir)
        os.makedirs(job_output_dir)

        teachers_path = os.path.join(job_upload_dir, teachers_file.filename)
        classes_path = os.path.join(job_upload_dir, classes_file.filename)

        # -------- Save uploaded files -------- #
        with open(teachers_path, "wb") as f:
            f.write(await teachers_file.read())

        with open(classes_path, "wb") as f:
            f.write(await classes_file.read())

        print(f"DEBUG: Files saved successfully at:")
        print(f"  Teachers: {teachers_path}")
        print(f"  Classes: {classes_path}")
        print(f"  Files exist: {os.path.exists(teachers_path)}, {os.path.exists(classes_path)}")

        # -------- Run routine generator -------- #
        try:
            result = generate_routine(
                teachers_excel_path=teachers_path,
                classes_excel_path=classes_path,
                output_base_dir=job_output_dir
            )
            print(f"DEBUG: Routine generator completed: {result}")
        except Exception as e:
            print(f"ERROR in generate_routine: {e}")
            print(traceback.format_exc())
            raise

        # -------- Zip output -------- #
        zip_path = os.path.join(OUTPUT_DIR, f"{job_id}.zip")
        print(f"DEBUG: Creating zip at: {zip_path}")

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(job_output_dir):
                for file in files:
                    full_path = os.path.join(root, file)
                    arcname = os.path.relpath(full_path, job_output_dir)
                    zipf.write(full_path, arcname)

        print(f"DEBUG: Zip created successfully: {zip_path}")

        # -------- Return ZIP -------- #
        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename="routine_output.zip"
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"\nERROR in generate_routine_api:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print("\nFull traceback:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")