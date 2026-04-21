from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import QuoteStatus


class QuoteItemBase(BaseModel):
    description: str
    quantity: float = 1
    unit_price: float


class QuoteItemCreate(QuoteItemBase):
    pass


class QuoteItemOut(QuoteItemBase):
    id: int

    class Config:
        from_attributes = True


class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None


class ClientCreate(ClientBase):
    pass


class ClientOut(ClientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class QuoteBase(BaseModel):
    title: str
    notes: Optional[str] = None
    valid_until: Optional[datetime] = None
    client_id: int


class QuoteCreate(QuoteBase):
    items: List[QuoteItemCreate] = []


class QuoteUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[QuoteStatus] = None
    notes: Optional[str] = None
    valid_until: Optional[datetime] = None
    items: Optional[List[QuoteItemCreate]] = None


class QuoteOut(QuoteBase):
    id: int
    quote_number: str
    status: QuoteStatus
    total: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    client: ClientOut
    items: List[QuoteItemOut]

    class Config:
        from_attributes = True


class StatsOut(BaseModel):
    total_quotes: int
    draft: int
    sent: int
    accepted: int
    rejected: int
    total_value: float


class UserOut(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None

    class Config:
        from_attributes = True
