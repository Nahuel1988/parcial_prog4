from collections.abc import Generator

from sqlmodel import Session

from app.core.database import engine


class SqlModelUnitOfWork:
    def __init__(self) -> None:
        self.session = Session(engine)

    def __enter__(self) -> "SqlModelUnitOfWork":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        if exc:
            self.session.rollback()
        self.session.close()


def get_uow() -> Generator[SqlModelUnitOfWork, None, None]:
    with SqlModelUnitOfWork() as uow:
        yield uow


def get_uow_session() -> Generator[Session, None, None]:
    with SqlModelUnitOfWork() as uow:
        yield uow.session
