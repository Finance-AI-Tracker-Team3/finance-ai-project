class Config:
    """Configuration for BudgetWise AI Service"""

    # MySQL Database Configuration
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'  # Change this to your MySQL username
    MYSQL_PASSWORD = '_Abs0042_'  # Change this to your MySQL password
    MYSQL_DB = 'budgetwise_ai'
    MYSQL_PORT = 3306

    # Flask Configuration
    DEBUG = True
    SECRET_KEY = 'budgetwise-infosys-internship-2025'

    # AI Model Settings
    MIN_DATA_POINTS = 5  # Minimum transactions needed for analysis
    MONTHS_TO_ANALYZE = 6  # Number of months to look back
