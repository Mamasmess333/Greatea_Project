# Greatea Inventory and Financial Management System

A comprehensive backend API for managing inventory, tracking financials, and optimizing operations for Greatea Suwanee LLC.

## Features

- **Inventory Management**: Track supplies, monitor expiration dates, and manage stock levels
- **Financial Tracking**: Record expenses, analyze spending patterns, and identify cost-saving opportunities
- **Advanced Analytics**: Get demand forecasts, supplier performance metrics, and restocking recommendations
- **Store Operations**: Transfer stock between storage and store, log usage, and manage restock requests

## Technologies Used

- **Backend**: Flask, SQLAlchemy
- **Database**: MySQL
- **Deployment**: Docker (optional)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd greatea-inventory-system
```

2. Create a virtual environment and activate it
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up environment variables
Create a `.env` file with the following variables:
```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_NAME=greatea_inventory_db
SECRET_KEY=your_secret_key
```

5. Initialize the database
```bash
# First run the SQL script to create the database and tables
mysql -u your_db_user -p < database/create_database.sql

# Then start the application to create any missing tables
python app.py
```

## API Endpoints

### Basic CRUD Operations

#### Supplies
- `GET /supplies` - List all supplies
- `GET /supplies/<id>` - Get a specific supply
- `POST /supplies` - Create a new supply
- `PUT /supplies/<id>` - Update a supply
- `DELETE /supplies/<id>` - Delete a supply

#### Suppliers
- `GET /suppliers` - List all suppliers
- `GET /suppliers/<id>` - Get a specific supplier
- `POST /suppliers` - Create a new supplier
- `PUT /suppliers/<id>` - Update a supplier
- `DELETE /suppliers/<id>` - Delete a supplier

#### Expenses
- `GET /expenses` - List all expenses
- `GET /expenses/<id>` - Get a specific expense
- `POST /expenses` - Create a new expense
- `PUT /expenses/<id>` - Update an expense
- `DELETE /expenses/<id>` - Delete an expense

#### Usage Records
- `GET /usage` - List all usage records
- `GET /usage/<id>` - Get a specific usage record
- `POST /usage` - Create a new usage record
- `PUT /usage/<id>` - Update a usage record
- `DELETE /usage/<id>` - Delete a usage record

#### Supply Orders
- `GET /orders` - List all supply orders
- `GET /orders/<id>` - Get a specific order
- `POST /orders` - Create a new order
- `PUT /orders/<id>` - Update an order
- `DELETE /orders/<id>` - Delete an order

#### Store Stock
- `GET /stock` - List all store stock
- `GET /stock/<id>` - Get a specific stock item
- `POST /stock` - Create a new stock item
- `PUT /stock/<id>` - Update a stock item
- `DELETE /stock/<id>` - Delete a stock item

#### Restock Requests
- `GET /restocks` - List all restock requests
- `GET /restocks/<id>` - Get a specific restock request
- `POST /restocks` - Create a new restock request
- `PUT /restocks/<id>` - Update a restock request
- `DELETE /restocks/<id>` - Delete a restock request

#### Market Purchases
- `GET /purchases` - List all market purchases
- `GET /purchases/<id>` - Get a specific purchase
- `POST /purchases` - Create a new purchase
- `PUT /purchases/<id>` - Update a purchase
- `DELETE /purchases/<id>` - Delete a purchase

### Advanced Analytics Endpoints

- `GET /analytics/expiring-soon` - Get supplies expiring soon
- `GET /analytics/stock-alerts` - Get alerts for low stock items
- `GET /analytics/spending-trends` - Get spending trends over time
- `GET /analytics/supplier-performance` - Analyze supplier performance metrics
- `GET /analytics/demand-forecast` - Get demand forecasts for supplies
- `GET /analytics/restock-recommendations` - Get restocking recommendations

### Report Endpoints

- `GET /dashboard/summary` - Get summary data for the dashboard
- `GET /reports/inventory` - Generate a comprehensive inventory report
- `GET /reports/financial` - Generate a financial analysis report

### Operations Endpoints

- `POST /operations/transfer-stock` - Transfer stock from storage to store

## Frontend Integration

The API is designed to be easily integrated with a frontend application. It returns JSON responses with consistent formatting and provides pagination support for listing endpoints.

## Development

To run the application in development mode:

```bash
python app.py
```

The API will be available at `http://localhost:5000`.

## Project Status

This project is currently in active development.

## Contributors

- Son Nguyen
- Andrew Alvarez

## License

This project is intended for educational and internal use only.
