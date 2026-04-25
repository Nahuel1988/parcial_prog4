from sqlmodel import Session, select

from app.modules.roles.models import Role
from app.modules.roles.schemas import RoleCreate, RoleUpdate


def create_role(session: Session, data: RoleCreate) -> Role:
    role = Role.model_validate(data)
    session.add(role)
    session.commit()
    session.refresh(role)
    return role


def list_roles(session: Session, *, offset: int = 0, limit: int = 20) -> list[Role]:
    statement = select(Role).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def get_role(session: Session, role_id: int) -> Role | None:
    return session.get(Role, role_id)


def update_role(session: Session, role_id: int, data: RoleUpdate) -> Role | None:
    role = session.get(Role, role_id)
    if role is None:
        return None

    role.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(role)
    session.commit()
    session.refresh(role)
    return role


def delete_role(session: Session, role_id: int) -> bool:
    role = session.get(Role, role_id)
    if role is None:
        return False

    session.delete(role)
    session.commit()
    return True
