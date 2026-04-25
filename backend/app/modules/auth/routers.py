import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.core.uow import get_uow_session
from app.modules.auth.schemas import LoginRequest, LoginResponse
from app.modules.users.services import authenticate_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, session: Session = Depends(get_uow_session)):
    user = authenticate_user(session, payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = secrets.token_urlsafe(32)
    return LoginResponse(access_token=token, user_id=user.id, email=user.email)
