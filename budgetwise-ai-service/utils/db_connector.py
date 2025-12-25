import pymysql
from config import Config


class DatabaseConnector:
    """Handles all MySQL database operations"""

    def __init__(self):
        self.connection = None

    def connect(self):
        """Establish connection to MySQL database"""
        try:
            self.connection = pymysql.connect(
                host=Config.MYSQL_HOST,
                user=Config.MYSQL_USER,
                password=Config.MYSQL_PASSWORD,
                database=Config.MYSQL_DB,
                port=Config.MYSQL_PORT,
                cursorclass=pymysql.cursors.DictCursor
            )
            return self.connection
        except Exception as e:
            print(f"❌ Database connection error: {e}")
            return None

    def get_user_expenses(self, user_id, months=6):
        """Fetch user expenses for last N months"""
        connection = self.connect()
        if not connection:
            return []

        try:
            with connection.cursor() as cursor:
                query = """
                    SELECT 
                        expense_id,
                        user_id,
                        category,
                        amount,
                        expense_date as date,
                        description
                    FROM expenses
                    WHERE user_id = %s 
                    AND expense_date >= DATE_SUB(CURDATE(), INTERVAL %s MONTH)
                    ORDER BY expense_date ASC
                """
                cursor.execute(query, (user_id, months))
                results = cursor.fetchall()

                # Convert date objects to strings for JSON serialization
                for row in results:
                    if row['date']:
                        row['date'] = row['date'].strftime('%Y-%m-%d')

                return results
        except Exception as e:
            print(f"❌ Error fetching expenses: {e}")
            return []
        finally:
            connection.close()

    def save_insight(self, user_id, insight_type, insight_data):
        """Save AI-generated insights to database"""
        connection = self.connect()
        if not connection:
            return False

        try:
            with connection.cursor() as cursor:
                import json
                query = """
                    INSERT INTO ai_insights (user_id, insight_type, insight_data)
                    VALUES (%s, %s, %s)
                """
                cursor.execute(query, (user_id, insight_type, json.dumps(insight_data)))
                connection.commit()
                return True
        except Exception as e:
            print(f"❌ Error saving insight: {e}")
            return False
        finally:
            connection.close()

    def test_connection(self):
        """Test database connectivity"""
        conn = self.connect()
        if conn:
            try:
                with conn.cursor() as cursor:
                    cursor.execute("SELECT VERSION()")
                    version = cursor.fetchone()
                    print(f"✓ MySQL Connected! Version: {version}")
                    return True
            finally:
                conn.close()
        return False
