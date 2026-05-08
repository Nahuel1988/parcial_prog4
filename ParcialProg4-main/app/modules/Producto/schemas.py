from typing import Optional,List
from sqlmodel import SQLModel,Field
from decimal import Decimal


class ProductoCreate(SQLModel):
    nombre:str=      Field(min_length=2, max_length=150)
    descripcion:str
    precio_base: Decimal= Field(ge=0)
    imagen_url:Optional[str]= None
    stock_cantidad:int = Field(ge=0,default=0)
    disponible:bool = Field(default=True)

    categoria_id: Optional[int]= None

class ProductoUpdate(SQLModel):
    nombre:Optional[str]= Field(default=None,min_length=2,max_length=150)
    descripcion:Optional[str]= None
    precio_base:Optional[Decimal]=Field(default=None,ge=0)
    imagen_url:Optional[str]=None
    stock_cantidad:Optional[int]=None
    disponible:Optional[bool]=None
    is_active: Optional[bool]= None
    categoria_id: Optional[int]= None
    ingrediente_ids: Optional[List[int]] = None 


class ProductoPublic(SQLModel):
    id: int 
    nombre: str
    descripcion:str
    precio_base: bool
    imagen_url:str
    disponible:bool
    is_active:bool
    ingredientes: List[int]=[]    
    categoria: Optional[CategoriaPublic] = None
    categoria_id: Optional[int]= None


class ProductoList(SQLModel):

    data:List[ProductoPublic]
    total:int  