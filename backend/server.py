from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List
import uuid

from models import (
    UserCreate, UserLogin, UserResponse, LoginResponse,
    DashboardStats, UserGrowthData, RoleDistribution, WeeklyActivity,
    UserUpdate, ProfileUpdate
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_current_admin
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "Admin User Management API"}

@api_router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_dict = {
        "id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "password": get_password_hash(user.password),
        "role": user.role,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_login": None
    }
    
    await db.users.insert_one(user_dict)
    return {"message": "User registered successfully", "userId": user_dict["id"]}

@api_router.post("/login", response_model=LoginResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    await db.users.update_one(
        {"email": credentials.email},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"], "role": user["role"]}
    )
    
    return LoginResponse(
        token=access_token,
        userId=user["id"],
        role=user["role"],
        name=user["name"]
    )

@api_router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_user: dict = Depends(get_current_admin)):
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    return users

@api_router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, current_user: dict = Depends(get_current_admin)):
    existing_user = await db.users.find_one({"email": user.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_dict = {
        "id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "password": get_password_hash(user.password),
        "role": user.role,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_login": None
    }
    
    await db.users.insert_one(user_dict)
    del user_dict["password"]
    return UserResponse(**user_dict)

@api_router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_update: UserUpdate, current_user: dict = Depends(get_current_admin)):
    existing_user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = {k: v for k, v in user_update.model_dump().items() if v is not None}
    
    if update_data:
        await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    return UserResponse(**updated_user)

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_admin)):
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {"message": "User deleted successfully"}

@api_router.get("/profile/{user_id}", response_model=UserResponse)
async def get_profile(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["sub"] != user_id and current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this profile"
        )
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse(**user)

@api_router.put("/profile/{user_id}", response_model=UserResponse)
async def update_profile(user_id: str, profile_update: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["sub"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this profile"
        )
    
    update_data = {k: v for k, v in profile_update.model_dump().items() if v is not None}
    
    if update_data:
        await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    return UserResponse(**updated_user)

@api_router.get("/analytics/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: dict = Depends(get_current_admin)):
    total_users = await db.users.count_documents({"role": "user"})
    total_admins = await db.users.count_documents({"role": "admin"})
    
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    new_users_today = await db.users.count_documents({
        "created_at": {"$gte": today_start.isoformat()}
    })
    
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    active_users = await db.users.count_documents({
        "last_login": {"$gte": week_ago}
    })
    
    return DashboardStats(
        total_users=total_users,
        total_admins=total_admins,
        active_users=active_users,
        new_users_today=new_users_today
    )

@api_router.get("/analytics/user-growth", response_model=List[UserGrowthData])
async def get_user_growth(current_user: dict = Depends(get_current_admin)):
    users = await db.users.find({}, {"_id": 0, "created_at": 1}).to_list(10000)
    
    growth_data = {}
    for user in users:
        date = user["created_at"][:10]
        growth_data[date] = growth_data.get(date, 0) + 1
    
    sorted_dates = sorted(growth_data.keys())
    cumulative = 0
    result = []
    for date in sorted_dates[-30:]:
        cumulative += growth_data[date]
        result.append(UserGrowthData(date=date, users=cumulative))
    
    return result

@api_router.get("/analytics/role-distribution", response_model=List[RoleDistribution])
async def get_role_distribution(current_user: dict = Depends(get_current_admin)):
    total_users = await db.users.count_documents({"role": "user"})
    total_admins = await db.users.count_documents({"role": "admin"})
    
    return [
        RoleDistribution(role="Users", count=total_users),
        RoleDistribution(role="Admins", count=total_admins)
    ]

@api_router.get("/analytics/weekly-activity", response_model=List[WeeklyActivity])
async def get_weekly_activity(current_user: dict = Depends(get_current_admin)):
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    
    activity_data = []
    for i, day in enumerate(days):
        logins = (i + 1) * 5
        activity_data.append(WeeklyActivity(day=day, logins=logins))
    
    return activity_data

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
