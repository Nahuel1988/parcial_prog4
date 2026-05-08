from fastapi import APIRouter, Depends,Query,status
from sqlmodel import Session
from app.core.database import get_session
from app.modules.Producto.service import ProductoService
from app.modules.Producto.schemas import ProductoCreate,ProductoUpdate,ProductoPublic,ProductoList
   

router = APIRouter()
