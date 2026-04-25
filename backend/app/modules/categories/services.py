from sqlmodel import Session, select

from app.modules.categories.models import Category
from app.modules.categories.schemas import CategoryCreate, CategoryUpdate


def create_category(session: Session, data: CategoryCreate) -> Category:
    category = Category.model_validate(data)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def list_categories(session: Session, *, offset: int = 0, limit: int = 20) -> list[Category]:
    statement = select(Category).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def get_category(session: Session, category_id: int) -> Category | None:
    return session.get(Category, category_id)


def update_category(session: Session, category_id: int, data: CategoryUpdate) -> Category | None:
    category = session.get(Category, category_id)
    if category is None:
        return None

    updates = data.model_dump(exclude_unset=True)
    category.sqlmodel_update(updates)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def delete_category(session: Session, category_id: int) -> bool:
    category = session.get(Category, category_id)
    if category is None:
        return False

    session.delete(category)
    session.commit()
    return True
