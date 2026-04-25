from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
from app.modules.users.schemas import UserCreate, UserPasswordUpdate, UserRead, UserUpdate
from app.modules.users.services import (
    create_user,
    delete_user,
    get_user,
    list_users,
    update_user,
    update_user_password,
)

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: UserCreate, session: Session = Depends(get_uow_session)):
    return create_user(session, payload)


@router.get("/", response_model=list[UserRead])
def read_items(
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_users(session, offset=offset, limit=limit)


@router.get("/{user_id}", response_model=UserRead)
def read_item(
    user_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    user = get_user(session, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserRead)
def update_item(
    user_id: Annotated[int, Path(gt=0)],
    payload: UserUpdate,
    session: Session = Depends(get_uow_session),
):
    user = update_user(session, user_id, payload)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.patch("/{user_id}/password", response_model=UserRead)
def update_password(
    user_id: Annotated[int, Path(gt=0)],
    payload: UserPasswordUpdate,
    session: Session = Depends(get_uow_session),
):
    user = update_user_password(session, user_id, payload.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    user_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    deleted = delete_user(session, user_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
