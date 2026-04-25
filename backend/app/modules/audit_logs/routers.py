from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
from app.modules.audit_logs.schemas import AuditLogCreate, AuditLogRead
from app.modules.audit_logs.services import create_audit_log, list_audit_logs

router = APIRouter(prefix="/auditoria", tags=["Auditoria"])


@router.post("/", response_model=AuditLogRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: AuditLogCreate, session: Session = Depends(get_uow_session)):
    return create_audit_log(session, payload)


@router.get("/", response_model=list[AuditLogRead])
def read_items(
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_audit_logs(session, offset=offset, limit=limit)
