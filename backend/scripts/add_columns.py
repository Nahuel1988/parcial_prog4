from sqlalchemy import text
import sys
sys.path.insert(0, 'backend')
from app.core.database import engine

# tables and columns to add
changes = [
    ('category', 'created_at', 'TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL'),
    ('category', 'updated_at', 'TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL'),
    ('product', 'created_at', 'TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL'),
    ('product', 'updated_at', 'TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL'),
    ('productcategory', 'created_at', 'TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL'),
    ('productcategory', 'updated_at', 'TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL'),
    ('productingredient', 'created_at', 'TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL'),
    ('productingredient', 'updated_at', 'TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL'),
]

with engine.begin() as conn:
    for table, column, definition in changes:
        sql = f"ALTER TABLE {table} ADD COLUMN {column} {definition};"
        try:
            conn.execute(text(sql))
            print(f"added {table}.{column}")
        except Exception as e:
            print(f"skipped {table}.{column}: {e}")

print('done')
