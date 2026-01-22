from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import hashlib
import time

app = FastAPI()

# Allows your React Interface to talk to this Python Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/sign")
async def sign_message(data: dict):
    # Retrieve message from Social Media UI
    message = data.get("text")
    
    # 1. Generate SHA3-512 Fingerprint
    fingerprint = hashlib.sha3_512(message.encode()).hexdigest()
    
    # 2. Simulate ML-DSA (Dilithium) Signature
    # In a real demo, this proves the sender's identity
    signature = f"PQC-SIG-{hashlib.md5(fingerprint.encode()).hexdigest()[:12]}"
    
    return {
        "fingerprint": fingerprint,
        "signature": signature,
        "status": "SECURED"
    }

@app.post("/verify")
async def verify_message(data: dict):
    original_fingerprint = data.get("fingerprint")
    received_text = data.get("text")
    
    # Recalculate hash to check for tampering
    current_fingerprint = hashlib.sha3_512(received_text.encode()).hexdigest()
    
    if original_fingerprint == current_fingerprint:
        return {"verified": True, "status": "GREEN"}
    else:
        return {"verified": False, "status": "RED"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
