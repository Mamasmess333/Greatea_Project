-- Create Database
DROP DATABASE IF EXISTS greatea_inventory_db;
CREATE DATABASE greatea_inventory_db;
USE greatea_inventory_db;

-- Create Suppliers Table
CREATE TABLE Suppliers (
    Supplier_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Contact VARCHAR(100),
    Lead_Time INT
);

-- Create Supplies Table
CREATE TABLE Supplies (
    Supply_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Category VARCHAR(50),
    Expiry_Date DATE,
    Total_Quantity DECIMAL(10,2),
    Cost_Per_Unit DECIMAL(10,2)
);

-- Create Supply_Orders Table
CREATE TABLE Supply_Orders (
    Order_ID INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE NOT NULL,
    Supplier_ID INT,
    Supply_ID INT,
    Quantity_Received DECIMAL(10,2),
    Total_Cost DECIMAL(10,2),
    FOREIGN KEY (Supplier_ID) REFERENCES Suppliers(Supplier_ID),
    FOREIGN KEY (Supply_ID) REFERENCES Supplies(Supply_ID)
);

-- Create Usage_Records Table
CREATE TABLE Usage_Records (
    Usage_ID INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE NOT NULL,
    Supply_ID INT,
    Quantity_Used DECIMAL(10,2),
    Location VARCHAR(50),
    FOREIGN KEY (Supply_ID) REFERENCES Supplies(Supply_ID)
);

-- Create Expenses Table
CREATE TABLE Expenses (
    Expense_ID INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE NOT NULL,
    Category VARCHAR(50),
    Amount DECIMAL(10,2)
);

-- Create Store_Stock Table
CREATE TABLE Store_Stock (
    Stock_ID INT PRIMARY KEY AUTO_INCREMENT,
    Supply_ID INT,
    Quantity_Available DECIMAL(10,2),
    Last_Updated DATETIME,
    FOREIGN KEY (Supply_ID) REFERENCES Supplies(Supply_ID)
);

-- Create Restock_Requests Table
CREATE TABLE Restock_Requests (
    Request_ID INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE NOT NULL,
    Supply_ID INT,
    Quantity_Requested DECIMAL(10,2),
    Request_Type ENUM('Transfer from Inventory', 'Purchase from Supplier'),
    FOREIGN KEY (Supply_ID) REFERENCES Supplies(Supply_ID)
);

-- Create Market_Purchases Table
CREATE TABLE Market_Purchases (
    Purchase_ID INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE NOT NULL,
    Item_Name VARCHAR(100),
    Quantity DECIMAL(10,2),
    Cost DECIMAL(10,2),
    Category VARCHAR(50)
);

-- Create Indexes for Performance
CREATE INDEX idx_supplies_name ON Supplies(Name);
CREATE INDEX idx_supplies_category ON Supplies(Category);
CREATE INDEX idx_usage_records_date ON Usage_Records(Date);
CREATE INDEX idx_expenses_date ON Expenses(Date);

-- Insert Sample Data for Initial Testing

-- Sample Suppliers
INSERT INTO Suppliers (Name, Contact, Lead_Time) VALUES 
('Fresh Produce Suppliers', '555-123-4567', 5),
('Beverage Distributors Inc.', '555-987-6543', 3),
('Snack Wholesalers', '555-246-8135', 4);

-- Sample Supplies
INSERT INTO Supplies (Name, Category, Expiry_Date, Total_Quantity, Cost_Per_Unit) VALUES 
('Green Tea Leaves', 'Tea', '2025-12-31', 100.50, 5.99),
('Milk', 'Dairy', '2025-04-15', 50.25, 3.49),
('Chocolate Syrup', 'Flavoring', '2025-06-30', 75.75, 4.25);

-- Sample Supply Orders
INSERT INTO Supply_Orders (Date, Supplier_ID, Supply_ID, Quantity_Received, Total_Cost) VALUES 
('2025-03-01', 1, 1, 50.25, 300.50),
('2025-03-05', 2, 2, 25.10, 87.60);

-- Sample Usage Records
INSERT INTO Usage_Records (Date, Supply_ID, Quantity_Used, Location) VALUES 
('2025-03-10', 1, 10.5, 'Main Store'),
('2025-03-15', 2, 5.25, 'Main Store');

-- Sample Expenses
INSERT INTO Expenses (Date, Category, Amount) VALUES 
('2025-03-01', 'Supply Purchase', 300.50),
('2025-03-05', 'Supply Purchase', 87.60);

-- Sample Store Stock
INSERT INTO Store_Stock (Supply_ID, Quantity_Available, Last_Updated) VALUES 
(1, 40.00, '2025-03-15 10:30:00'),
(2, 20.00, '2025-03-15 10:30:00');

-- Sample Restock Requests
INSERT INTO Restock_Requests (Date, Supply_ID, Quantity_Requested, Request_Type) VALUES 
('2025-03-20', 1, 25.00, 'Purchase from Supplier'),
('2025-03-22', 2, 15.00, 'Transfer from Inventory');

-- Sample Market Purchases
INSERT INTO Market_Purchases (Date, Item_Name, Quantity, Cost, Category) VALUES 
('2025-03-10', 'Fresh Strawberries', 10.50, 45.75, 'Fruits'),
('2025-03-15', 'Local Honey', 5.25, 22.50, 'Sweeteners');