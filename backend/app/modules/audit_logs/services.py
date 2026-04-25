from sqlmodel import Session, select

from app.modules.audit_logs.models import AuditLog
from app.modules.audit_logs.schemas import AuditLogCreate


def create_audit_log(session: Session, data: AuditLogCreate) -> AuditLog:
    log = AuditLog.model_validate(data)
    session.add(log)
    session.commit()
    session.refresh(log)
    return log


def list_audit_logs(session: Session, *, offset: int = 0, limit: int = 20) -> list[AuditLog]:
    statement = select(AuditLog).order_by(AuditLog.created_at.desc()).offset(offset).limit(limit)
    return list(session.exec(statement).all())
