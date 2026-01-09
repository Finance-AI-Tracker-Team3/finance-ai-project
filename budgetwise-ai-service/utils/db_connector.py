import pymysql
from config import Config


class DatabaseConnector:

    def connect(self):
        return pymysql.connect(
            host=Config.MYSQL_HOST,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DB,
            port=Config.MYSQL_PORT,
            cursorclass=pymysql.cursors.DictCursor
        )

    def get_user_expenses(self, user_id, months=6):
        conn = self.connect()
        try:
            with conn.cursor() as cur:
                query = """
                    SELECT
                        t.transaction_id AS expense_id,
                        COALESCE(c.category_name, 'Others') AS category,
                        ABS(t.amount) AS amount,
                        t.transaction_date AS date
                    FROM transactions t
                    LEFT JOIN categories c ON t.category_id = c.category_id
                    WHERE t.user_id = %s
                      AND t.type = 'EXPENSE'
                      AND t.transaction_date >= DATE_SUB(CURDATE(), INTERVAL %s MONTH)
                    ORDER BY t.transaction_date
                """
                cur.execute(query, (user_id, months))
                data = cur.fetchall()

                for row in data:
                    row["date"] = row["date"].strftime("%Y-%m-%d")

                return data
        finally:
            conn.close()

    def get_user_income(self, user_id, months=6):
        conn = self.connect()
        try:
            with conn.cursor() as cur:
                query = """
                    SELECT SUM(amount) AS income
                    FROM transactions
                    WHERE user_id = %s
                      AND type = 'INCOME'
                      AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL %s MONTH)
                """
                cur.execute(query, (user_id, months))
                result = cur.fetchone()
                return float(result["income"]) if result["income"] else 0
        finally:
            conn.close()
