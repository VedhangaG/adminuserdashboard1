from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, Literal
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Literal["admin", "user"] = "user"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["admin", "user"] = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    name: str
    email: EmailStr
    role: str
    created_at: str
    last_login: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Literal["admin", "user"]] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class LoginResponse(BaseModel):
    token: str
    userId: str
    role: str
    name: str

class DashboardStats(BaseModel):
    total_users: int
    total_admins: int
    active_users: int
    new_users_today: int

class UserGrowthData(BaseModel):
    date: str
    users: int

class RoleDistribution(BaseModel):
    role: str
    count: int

class WeeklyActivity(BaseModel):
    day: str
    logins: int
