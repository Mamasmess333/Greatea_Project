# Greatea Inventory & Financial Management System

## 🚀 Getting Started

These instructions will get your development environment set up to run the backend Flask server locally.

---

### 📦 Requirements

- Python 3.8+
- MySQL server (and DBeaver or MySQL Workbench)
- pip (Python package manager)
- Git (to clone the repository)

---

### 🔧 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/Mamasmess333/Greatea_Project.git
cd Greatea_Project
```

2. **Install the required Python packages**

```bash
pip install -r requirements.txt
```

3. **Create a MySQL database**

Open your MySQL client (DBeaver, MySQL Workbench, or terminal), then create a database:

```sql
CREATE DATABASE greatea_inventory_db;
```

4. **Copy and edit the environment config file**

In the project folder, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then open `.env` and set your own MySQL credentials:

```env
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_NAME=greatea_inventory_db
```

5. **Run the backend Flask server**

```bash
python app.py
```

This will:
- Connect to your local MySQL database
- Create all necessary tables
- Start a development server at:  
  👉 `http://localhost:5000`

---

## 🧪 Testing the API

You can use Postman or your browser to test the endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/supplies` | GET | Get all supply records |
| `/supplies/<id>` | GET | Get a single supply |
| `/supplies` | POST | Add a new supply |
| `/supplies/<id>` | PUT | Update a supply |
| `/supplies/<id>` | DELETE | Delete a supply |

Example test data:

```json
{
  "Name": "Taro Powder",
  "Category": "Flavoring",
  "Expiry_Date": "2025-07-01",
  "Total_Quantity": 100,
  "Cost_Per_Unit": 3.75
}
```

---

## 🌱 Seeding the Database with Sample Data

After running the backend, you can auto-populate the database with mock data:

```bash
python seed.py
```

This will insert several sample `Supplies` records so you can test immediately.

---

## ✅ You're All Set!

If you see the Flask server running and your Postman/API tests return data — everything is working! Let Andrew know if you run into issues, and be sure to keep `.env` private.
