from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
from app.modules.categories.schemas import CategoryCreate, CategoryRead, CategoryUpdate
from app.modules.categories.services import (
    create_category,
    delete_category,
    get_category,
    list_categories,
    update_category,
)

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.post("/", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: CategoryCreate, session: Session = Depends(get_uow_session)):
    return create_category(session, payload)


@router.get("/", response_model=list[CategoryRead])
def read_items(
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_categories(session, offset=offset, limit=limit)


@router.get("/{category_id}", response_model=CategoryRead)
def read_item(
    category_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    category = get_category(session, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


@router.patch("/{category_id}", response_model=CategoryRead)
def update_item(
    category_id: Annotated[int, Path(gt=0)],
    payload: CategoryUpdate,
    session: Session = Depends(get_uow_session),
):
    category = update_category(session, category_id, payload)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    category_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    deleted = delete_category(session, category_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
