import sys
sys.path.insert(0, r'C:\Users\moral\OneDrive\Desktop\parcial_prog4\backend')
from app.core.database import engine
from sqlmodel import Session, select
from app.modules.categories.models import Category
from app.modules.products.models import Product
from app.modules.product_categories.models import ProductCategory
from app.modules.product_ingredients.models import ProductIngredient

with Session(engine) as s:
    print('categories', len(s.exec(select(Category)).all()))
    print('products', len(s.exec(select(Product)).all()))
