from datetime import datetime
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str


class UserPublic(BaseModel):
    id: int
    username: str
    email: EmailStr
    isAdmin: bool = False


class AuthResponse(BaseModel):
    user: UserPublic
    token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    email: EmailStr
    newPassword: str


class ScoreSubmitRequest(BaseModel):
    buildingId: str
    score: int
    livesRemaining: int | None = None
    timeTaken: int | None = None


class PuzzleCreateRequest(BaseModel):
    buildingId: str
    puzzleOrder: int
    question: str
    options: list
    correctAnswer: int
    explanation: str | None = None
    hint: str | None = None
    timeLimit: int | None = 30


class PuzzleUpdateRequest(BaseModel):
    question: str
    options: list
    correctAnswer: int
    explanation: str | None = None
    hint: str | None = None
    timeLimit: int | None = 30


class MeResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime
