from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
import jwt
import json
from google import genai  # <-- NAYA UPDATED SDK
from datetime import datetime, timedelta

# ==========================================
# 1. DATABASE SETUP & MODELS
# ==========================================
SQLALCHEMY_DATABASE_URL = "sqlite:///./hr_database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class EmployeeDB(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True) 
    role = Column(String)
    joining_date = Column(String)

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    initials = Column(String)

Base.metadata.create_all(bind=engine)

# ==========================================
# 2. AI AGENT CONFIGURATION (NEW SDK)
# ==========================================
client = genai.Client(api_key="AIzaSyDM1jWKIYIEi7SSBytafEvqi-Kksj6GoZQ")

# ==========================================
# 3. APP INITIALIZATION & CORS
# ==========================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 4. SECURITY & JWT CONFIGURATION
# ==========================================
# Secret key ab 32+ characters ki hai taaki koi warning na aaye
SECRET_KEY = "workspace-hr-secure-key-2026-super-safe-and-long-enough-for-sha256"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# ==========================================
# 5. PYDANTIC SCHEMAS
# ==========================================
class EmployeeCreate(BaseModel):
    name: str
    email: str
    role: str
    joining_date: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ResumeParseRequest(BaseModel):
    resume_text: str

# ==========================================
# 6. AUTHENTICATION ENDPOINTS
# ==========================================
@app.post("/api/setup-admin/")
def setup_admin(db: Session = Depends(get_db)):
    """Creates a default admin user for initial login."""
    admin = db.query(UserDB).filter(UserDB.email == "admin@company.com").first()
    if admin:
        return {"message": "Admin already exists!"}
    
    hashed_pwd = get_password_hash("admin123")
    new_admin = UserDB(email="admin@company.com", hashed_password=hashed_pwd, name="HR Admin", initials="HA")
    db.add(new_admin)
    db.commit()
    return {"message": "Admin created successfully. Login with admin@company.com / admin123"}

@app.post("/api/login/")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Verifies credentials and returns JWT token."""
    user = db.query(UserDB).filter(UserDB.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "token": access_token,
        "user": {"name": user.name, "email": user.email, "initials": user.initials}
    }

# ==========================================
# 7. AI AGENT ENDPOINT (RESUME PARSING)
# ==========================================
@app.post("/api/parse-resume/")
def parse_resume_with_ai(request: ResumeParseRequest, current_user: UserDB = Depends(get_current_user)):
    """AI Agent that autonomously extracts structured data from raw resume text."""
    try:
        prompt = f"""
        You are an expert HR AI Agent. Extract the following details from the given resume text.
        Return ONLY a valid JSON object, absolutely nothing else. No markdown, no formatting.
        Schema required: {{"name": "Full Name", "email": "Email Address", "role": "Best matching role (Software Engineer, Data Scientist, Product Manager, or HR Executive)"}}
        
        Resume Text:
        {request.resume_text}
        """
        
        # Calling the new Gemini SDK
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        # Clean markdown formatting if present
        clean_json_string = response.text.replace('```json', '').replace('```', '').strip()
        extracted_data = json.loads(clean_json_string)
        
        return {"message": "AI Extraction Successful", "data": extracted_data}
        
    except Exception as e:
        # Ye line terminal mein print hogi agar koi dikkat aati hai
        print(f"\n{'='*40}\nAI AGENT ERROR:\n{str(e)}\n{'='*40}\n")
        raise HTTPException(status_code=500, detail="AI parsing failed. Check terminal for details.")

# ==========================================
# 8. PROTECTED EMPLOYEE ENDPOINTS
# ==========================================
@app.post("/api/employees/")
def create_employee(emp: EmployeeCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    try:
        new_employee = EmployeeDB(name=emp.name, email=emp.email, role=emp.role, joining_date=emp.joining_date)
        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)
        return {"message": "Employee added successfully", "data": new_employee}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="An employee with this email already exists.")

@app.get("/api/employees/")
def get_employees(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    return db.query(EmployeeDB).all()

@app.delete("/api/employees/{emp_id}")
def delete_employee(emp_id: int, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    employee = db.query(EmployeeDB).filter(EmployeeDB.id == emp_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(employee)
    db.commit()
    return {"message": "Employee removed successfully"}