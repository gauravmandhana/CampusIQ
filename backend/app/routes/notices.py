from app.utils.security import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.notice import Notice

router = APIRouter(
    prefix="/notices",
    tags=["Notices"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/")
def get_notices(db: Session = Depends(get_db)):
    notices = db.query(Notice).order_by(
        Notice.created_at.desc()
    ).all()

    return {
        "status": "success",
        "count": len(notices),
        "notices": notices
    }


@router.get("/important")
def get_important_notices(
    db: Session = Depends(get_db)
):
    notices = db.query(Notice).filter(
        Notice.is_important == True
    ).order_by(
        Notice.created_at.desc()
    ).all()

    return {
        "status": "success",
        "count": len(notices),
        "notices": notices
    }