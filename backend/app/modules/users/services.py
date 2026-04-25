import hashlib

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.modules.users.models import User
from app.modules.users.schemas import UserCreate, UserUpdate


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _get_user_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def create_user(session: Session, data: UserCreate) -> User:
    existing = _get_user_by_email(session, data.email)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    payload = data.model_dump(exclude={"password"})
    user = User.model_validate({**payload, "password_hash": _hash_password(data.password)})
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def list_users(session: Session, *, offset: int = 0, limit: int = 20) -> list[User]:
    statement = select(User).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def get_user(session: Session, user_id: int) -> User | None:
    return session.get(User, user_id)


def update_user(session: Session, user_id: int, data: UserUpdate) -> User | None:
    user = session.get(User, user_id)
    if user is None:
        return None

    if data.email and data.email != user.email:
        existing = _get_user_by_email(session, data.email)
        if existing is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    user.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def update_user_password(session: Session, user_id: int, password: str) -> User | None:
    user = session.get(User, user_id)
    if user is None:
        return None

    user.password_hash = _hash_password(password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def delete_user(session: Session, user_id: int) -> bool:
    user = session.get(User, user_id)
    if user is None:
        return False

    session.delete(user)
    session.commit()
    return True


def authenticate_user(session: Session, email: str, password: str) -> User | None:
    user = _get_user_by_email(session, email)
    if user is None or not user.activo:
        return None

    return user if user.password_hash == _hash_password(password) else None
