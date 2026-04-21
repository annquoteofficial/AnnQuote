from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from database import get_db
from dependencies import get_current_user
import models, schemas
from datetime import datetime

router = APIRouter(prefix="/quotes", tags=["quotes"], dependencies=[Depends(get_current_user)])


def _next_quote_number(db: Session) -> str:
    count = db.query(func.count(models.Quote.id)).scalar()
    return f"QT-{datetime.now().year}-{str(count + 1).zfill(4)}"


@router.get("/stats", response_model=schemas.StatsOut)
def get_stats(db: Session = Depends(get_db)):
    quotes = db.query(models.Quote).all()
    totals = {s.value: 0 for s in models.QuoteStatus}
    total_value = 0.0
    for q in quotes:
        totals[q.status.value] += 1
        total_value += q.total
    return schemas.StatsOut(
        total_quotes=len(quotes),
        draft=totals["draft"],
        sent=totals["sent"],
        accepted=totals["accepted"],
        rejected=totals["rejected"],
        total_value=total_value,
    )


@router.get("/", response_model=List[schemas.QuoteOut])
def list_quotes(
    skip: int = 0,
    limit: int = 50,
    status: Optional[models.QuoteStatus] = None,
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(models.Quote)
    if status:
        q = q.filter(models.Quote.status == status)
    if search:
        q = q.join(models.Client).filter(
            models.Quote.title.ilike(f"%{search}%")
            | models.Client.name.ilike(f"%{search}%")
        )
    return q.order_by(models.Quote.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=schemas.QuoteOut, status_code=201)
def create_quote(quote: schemas.QuoteCreate, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == quote.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    items_data = quote.items
    quote_data = quote.model_dump(exclude={"items"})
    db_quote = models.Quote(**quote_data, quote_number=_next_quote_number(db))
    db.add(db_quote)
    db.flush()
    for item in items_data:
        db.add(models.QuoteItem(**item.model_dump(), quote_id=db_quote.id))
    db.commit()
    db.refresh(db_quote)
    return db_quote


@router.get("/{quote_id}", response_model=schemas.QuoteOut)
def get_quote(quote_id: int, db: Session = Depends(get_db)):
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote


@router.put("/{quote_id}", response_model=schemas.QuoteOut)
def update_quote(quote_id: int, data: schemas.QuoteUpdate, db: Session = Depends(get_db)):
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    update_data = data.model_dump(exclude_unset=True, exclude={"items"})
    for k, v in update_data.items():
        setattr(quote, k, v)
    if data.items is not None:
        db.query(models.QuoteItem).filter(models.QuoteItem.quote_id == quote_id).delete()
        for item in data.items:
            db.add(models.QuoteItem(**item.model_dump(), quote_id=quote_id))
    db.commit()
    db.refresh(quote)
    return quote


@router.delete("/{quote_id}", status_code=204)
def delete_quote(quote_id: int, db: Session = Depends(get_db)):
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    db.delete(quote)
    db.commit()
