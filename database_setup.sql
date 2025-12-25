-- ============================================================
-- BudgetWise AI - Database Setup Script
-- Infosys Internship Project
-- ============================================================

-- Step 1: Create Database
DROP DATABASE IF EXISTS budgetwise_ai;
CREATE DATABASE budgetwise_ai;
USE budgetwise_ai;

-- ============================================================
-- Table 1: Expenses Table
-- Stores all user expense transactions
-- ============================================================
CREATE TABLE expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes for better query performance
    INDEX idx_user_id (user_id),
    INDEX idx_expense_date (expense_date),
    INDEX idx_user_date (user_id, expense_date),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Table 2: AI Insights Table
-- Stores AI-generated analysis results for caching
-- ============================================================
CREATE TABLE ai_insights (
    insight_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    insight_type VARCHAR(50) NOT NULL,
    insight_data JSON NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_user_type (user_id, insight_type),
    INDEX idx_generated_at (generated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Step 2: Insert Sample Data for Testing
-- ============================================================

-- Sample User ID = 1
-- October 2025 Data
INSERT INTO expenses (user_id, category, amount, expense_date, description) VALUES
(1, 'Food', 500, '2025-10-01', 'Groceries'),
(1, 'Food', 800, '2025-10-05', 'Restaurant dinner'),
(1, 'Transport', 300, '2025-10-10', 'Uber ride'),
(1, 'Food', 600, '2025-10-15', 'Food delivery'),
(1, 'Entertainment', 1200, '2025-10-20', 'Movie tickets'),
(1, 'Shopping', 2500, '2025-10-25', 'Clothes shopping'),
(1, 'Transport', 400, '2025-10-28', 'Fuel');

-- November 2025 Data
INSERT INTO expenses (user_id, category, amount, expense_date, description) VALUES
(1, 'Food', 900, '2025-11-01', 'Weekly groceries'),
(1, 'Food', 1200, '2025-11-05', 'Restaurant outing'),
(1, 'Transport', 500, '2025-11-10', 'Cab service'),
(1, 'Food', 1500, '2025-11-15', 'Party expenses'),
(1, 'Entertainment', 800, '2025-11-20', 'Concert tickets'),
(1, 'Shopping', 3000, '2025-11-22', 'Electronics purchase'),
(1, 'Food', 700, '2025-11-28', 'Monthly groceries');

-- December 2025 Data (Current Month)
INSERT INTO expenses (user_id, category, amount, expense_date, description) VALUES
(1, 'Food', 1800, '2025-12-01', 'Bulk groceries'),
(1, 'Food', 2000, '2025-12-03', 'Fine dining'),
(1, 'Transport', 600, '2025-12-04', 'Airport travel'),
(1, 'Food', 1200, '2025-12-05', 'Food delivery'),
(1, 'Entertainment', 1500, '2025-12-05', 'Gaming subscription'),
(1, 'Shopping', 4000, '2025-12-05', 'Gadgets and accessories');

-- ANOMALY DATA (For testing Anomaly Detection AI)
-- These are intentionally unusual high-value transactions
INSERT INTO expenses (user_id, category, amount, expense_date, description) VALUES
(1, 'Food', 5000, '2025-11-10', 'Party catering - UNUSUAL'),
(1, 'Transport', 8000, '2025-11-15', 'Emergency flight ticket - UNUSUAL'),
(1, 'Shopping', 15000, '2025-11-20', 'Laptop purchase - UNUSUAL'),
(1, 'Entertainment', 3500, '2025-11-28', 'Concert VIP tickets - UNUSUAL');

-- ============================================================
-- Step 3: Verify Data Insertion
-- ============================================================

-- Check total expenses
SELECT COUNT(*) as total_expenses FROM expenses;

-- Check expenses by category
SELECT
    category,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM expenses
GROUP BY category
ORDER BY total_amount DESC;

-- Check monthly spending
SELECT
    DATE_FORMAT(expense_date, '%Y-%m') as month,
    COUNT(*) as transactions,
    SUM(amount) as total_spending
FROM expenses
GROUP BY DATE_FORMAT(expense_date, '%Y-%m')
ORDER BY month;

-- ============================================================
-- Step 4: Create Additional Sample Users (Optional)
-- ============================================================

-- Sample User ID = 2 (Your teammates can test with different users)
INSERT INTO expenses (user_id, category, amount, expense_date, description) VALUES
(2, 'Food', 600, '2025-11-01', 'Groceries'),
(2, 'Transport', 350, '2025-11-05', 'Metro card'),
(2, 'Food', 900, '2025-11-10', 'Restaurant'),
(2, 'Entertainment', 500, '2025-11-15', 'Movie night'),
(2, 'Shopping', 2000, '2025-11-20', 'Clothing'),
(2, 'Food', 750, '2025-12-01', 'Weekly shopping'),
(2, 'Transport', 400, '2025-12-03', 'Cab rides');

-- ============================================================
-- Useful Queries for Testing
-- ============================================================

-- Query 1: Get all expenses for user 1
-- SELECT * FROM expenses WHERE user_id = 1 ORDER BY expense_date DESC;

-- Query 2: Get expenses for last 3 months
-- SELECT * FROM expenses
-- WHERE user_id = 1
-- AND expense_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
-- ORDER BY expense_date;

-- Query 3: Category-wise spending
-- SELECT category, SUM(amount) as total
-- FROM expenses
-- WHERE user_id = 1
-- GROUP BY category
-- ORDER BY total DESC;

-- Query 4: Monthly trend
-- SELECT
--     DATE_FORMAT(expense_date, '%Y-%m') as month,
--     SUM(amount) as monthly_total
-- FROM expenses
-- WHERE user_id = 1
-- GROUP BY DATE_FORMAT(expense_date, '%Y-%m')
-- ORDER BY month;

-- ============================================================
-- Database Setup Complete! ✅
-- ============================================================

-- Next Steps:
-- 1. Update config.py with your MySQL credentials
-- 2. Run: python app.py
-- 3. Test API: http://localhost:5001/health
-- 4. Access Dashboard: http://localhost:3000

SELECT 'Database setup completed successfully!' as status;
SELECT CONCAT('Total expenses inserted: ', COUNT(*)) as result FROM expenses;
