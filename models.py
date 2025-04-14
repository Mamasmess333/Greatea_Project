from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# -------------------- Supplies --------------------
class Supplies(db.Model):
    __tablename__ = 'Supplies'
    Supply_ID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(100), nullable=False)
    Category = db.Column(db.String(50))
    Expiry_Date = db.Column(db.Date)
    Total_Quantity = db.Column(db.Float)
    Cost_Per_Unit = db.Column(db.Float)

    def to_dict(self):
        return {
            'Supply_ID': self.Supply_ID,
            'Name': self.Name,
            'Category': self.Category,
            'Expiry_Date': self.Expiry_Date.isoformat() if self.Expiry_Date else None,
            'Total_Quantity': self.Total_Quantity,
            'Cost_Per_Unit': self.Cost_Per_Unit
        }

# -------------------- Suppliers --------------------
class Suppliers(db.Model):
    __tablename__ = 'Suppliers'
    Supplier_ID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(100), nullable=False)
    Contact = db.Column(db.String(100))
    Lead_Time = db.Column(db.Integer)

    def to_dict(self):
        return {
            'Supplier_ID': self.Supplier_ID,
            'Name': self.Name,
            'Contact': self.Contact,
            'Lead_Time': self.Lead_Time
        }

# -------------------- Usage Records --------------------
class UsageRecords(db.Model):
    __tablename__ = 'Usage_Records'
    Usage_ID = db.Column(db.Integer, primary_key=True)
    Date = db.Column(db.Date)
    Supply_ID = db.Column(db.Integer, db.ForeignKey('Supplies.Supply_ID'))
    Quantity_Used = db.Column(db.Float)
    Location = db.Column(db.String(100))

    def to_dict(self):
        return {
            'Usage_ID': self.Usage_ID,
            'Date': self.Date.isoformat() if self.Date else None,
            'Supply_ID': self.Supply_ID,
            'Quantity_Used': self.Quantity_Used,
            'Location': self.Location
        }

# -------------------- Expenses --------------------
class Expenses(db.Model):
    __tablename__ = 'Expenses'
    Expense_ID = db.Column(db.Integer, primary_key=True)
    Date = db.Column(db.Date)
    Category = db.Column(db.String(50))
    Amount = db.Column(db.Float)

    def to_dict(self):
        return {
            'Expense_ID': self.Expense_ID,
            'Date': self.Date.isoformat() if self.Date else None,
            'Category': self.Category,
            'Amount': self.Amount
        }

# -------------------- Supply Orders --------------------
class SupplyOrders(db.Model):
    __tablename__ = 'Supply_Orders'
    Order_ID = db.Column(db.Integer, primary_key=True)
    Date = db.Column(db.Date)
    Supplier_ID = db.Column(db.Integer, db.ForeignKey('Suppliers.Supplier_ID'))
    Supply_ID = db.Column(db.Integer, db.ForeignKey('Supplies.Supply_ID'))
    Quantity_Received = db.Column(db.Float)
    Total_Cost = db.Column(db.Float)

    def to_dict(self):
        return {
            'Order_ID': self.Order_ID,
            'Date': self.Date.isoformat() if self.Date else None,
            'Supplier_ID': self.Supplier_ID,
            'Supply_ID': self.Supply_ID,
            'Quantity_Received': self.Quantity_Received,
            'Total_Cost': self.Total_Cost
        }

# -------------------- Store Stock --------------------
class StoreStock(db.Model):
    __tablename__ = 'Store_Stock'
    Stock_ID = db.Column(db.Integer, primary_key=True)
    Supply_ID = db.Column(db.Integer, db.ForeignKey('Supplies.Supply_ID'))
    Quantity_Available = db.Column(db.Float)
    Last_Updated = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'Stock_ID': self.Stock_ID,
            'Supply_ID': self.Supply_ID,
            'Quantity_Available': self.Quantity_Available,
            'Last_Updated': self.Last_Updated.isoformat() if self.Last_Updated else None
        }

# -------------------- Restock Requests --------------------
class RestockRequests(db.Model):
    __tablename__ = 'Restock_Requests'
    Request_ID = db.Column(db.Integer, primary_key=True)
    Date = db.Column(db.Date)
    Supply_ID = db.Column(db.Integer, db.ForeignKey('Supplies.Supply_ID'))
    Quantity_Requested = db.Column(db.Float)
    Request_Type = db.Column(db.Enum('Transfer from Inventory', 'Purchase from Supplier'))

    def to_dict(self):
        return {
            'Request_ID': self.Request_ID,
            'Date': self.Date.isoformat() if self.Date else None,
            'Supply_ID': self.Supply_ID,
            'Quantity_Requested': self.Quantity_Requested,
            'Request_Type': self.Request_Type
        }

# -------------------- Market Purchases --------------------
class MarketPurchases(db.Model):
    __tablename__ = 'Market_Purchases'
    Purchase_ID = db.Column(db.Integer, primary_key=True)
    Date = db.Column(db.Date)
    Item_Name = db.Column(db.String(100))
    Quantity = db.Column(db.Float)
    Cost = db.Column(db.Float)
    Category = db.Column(db.String(50))

    def to_dict(self):
        return {
            'Purchase_ID': self.Purchase_ID,
            'Date': self.Date.isoformat() if self.Date else None,
            'Item_Name': self.Item_Name,
            'Quantity': self.Quantity,
            'Cost': self.Cost,
            'Category': self.Category
        }
