import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    try:
        # Connect to default 'postgres' database
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="pokhara2025",
            host="localhost"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'lokai'")
        exists = cur.fetchone()
        
        if not exists:
            print("Creating database 'lokai'...")
            cur.execute("CREATE DATABASE lokai")
            print("Database created.")
        else:
            print("Database 'lokai' already exists.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_database()
