from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
from app.modules.roles.schemas import RoleCreate, RoleRead, RoleUpdate
from app.modules.roles.services import create_role, delete_role, get_role, list_roles, update_role

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.post("/", response_model=RoleRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: RoleCreate, session: Session = Depends(get_uow_session)):
    return create_role(session, payload)


@router.get("/", response_model=list[RoleRead])
def read_items(
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_roles(session, offset=offset, limit=limit)


@router.get("/{role_id}", response_model=RoleRead)
def read_item(
    role_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    role = get_role(session, role_id)
    if role is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    return role


@router.patch("/{role_id}", response_model=RoleRead)
def update_item(
    role_id: Annotated[int, Path(gt=0)],
    payload: RoleUpdate,
    session: Session = Depends(get_uow_session),
):
    role = update_role(session, role_id, payload)
    if role is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    return role


@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    role_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    deleted = delete_role(session, role_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
