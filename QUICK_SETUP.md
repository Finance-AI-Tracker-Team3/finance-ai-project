# 🚀 BudgetWise AI - Quick Setup Guide

## Step 1: Database Setup (5 minutes)

### Option A: MySQL Workbench (Recommended)
1. Open **MySQL Workbench**
2. Connect to your local MySQL server
3. Click **File** → **Open SQL Script**
4. Select `database_setup.sql`
5. Click **Execute** ⚡ button (lightning icon)
6. Done! Database created with sample data ✅

### Option B: MySQL Command Line
## 🗄️ Database Setup

### Quick Method (Recommended)

1. Open **MySQL Workbench**
2. Run the provided `database_setup.sql` file
3. Done! Database with sample data is ready ✅

### Manual Method

Run these commands in MySQL:


### Database Schema

**Expenses Table:**
- `expense_id` (Primary Key)
- `user_id` (INT)
- `category` (VARCHAR)
- `amount` (DECIMAL)
- `expense_date` (DATE)
- `description` (VARCHAR)
- `created_at` (TIMESTAMP)

**AI Insights Table:**
- `insight_id` (Primary Key)
- `user_id` (INT)
- `insight_type` (VARCHAR)
- `insight_data` (JSON)
- `generated_at` (TIMESTAMP)

### Sample Data Included

- ✅ 3 months of transaction data (Oct-Dec 2025)
- ✅ Multiple expense categories
- ✅ Anomaly test cases (unusual high-value transactions)
- ✅ 2 sample users for testing
