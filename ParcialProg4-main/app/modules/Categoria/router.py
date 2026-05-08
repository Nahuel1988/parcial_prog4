from fastapi import APIRouter, Depends,Query,status
from sqlmodel import Session
from app.core.database import get_session
from app.modules.Categoria.service import CategoriaService
from app.modules.Categoria.schemas import CategoriaCreate,CategoriaUpDate,CategoriaPublic,CategoriaList   

router = APIRouter()
