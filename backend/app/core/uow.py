from collections.abc import Generator

from sqlmodel import Session

from app.core.database import engine


class SqlModelUnitOfWork:
    def __init__(self) -> None:
        self.session = Session(engine)
        self._committed = False

    def __enter__(self) -> "SqlModelUnitOfWork":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        if exc:
            self.session.rollback()
        else:
            # do not auto-commit here; commit should be explicit via `commit()`
            pass
        self.session.close()

    def commit(self) -> None:
        self.session.commit()
        self._committed = True

    def rollback(self) -> None:
        self.session.rollback()


def get_uow() -> Generator[SqlModelUnitOfWork, None, None]:
    with SqlModelUnitOfWork() as uow:
        yield uow


def get_uow_session() -> Generator[Session, None, None]:
    with SqlModelUnitOfWork() as uow:
        yield uow.session
