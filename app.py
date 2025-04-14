from flask_cors import CORS
from flask import Flask, request, jsonify
from config import Config
from models import db, Supplies, Suppliers, Expenses, UsageRecords, SupplyOrders, StoreStock, RestockRequests, MarketPurchases
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

@app.route('/')
def home():
    return "Welcome to Greatea Inventory API"

# -------------------- SUPPLIES CRUD --------------------
@app.route('/supplies', methods=['GET'])
def get_supplies():
    supplies = Supplies.query.all()
    return jsonify([s.to_dict() for s in supplies])

@app.route('/supplies/<int:id>', methods=['GET'])
def get_supply(id):
    supply = Supplies.query.get_or_404(id)
    return jsonify(supply.to_dict())

@app.route('/supplies', methods=['POST'])
def add_supply():
    data = request.json
    new_supply = Supplies(
        Name=data['Name'],
        Category=data.get('Category'),
        Expiry_Date=datetime.strptime(data.get('Expiry_Date'), '%Y-%m-%d') if data.get('Expiry_Date') else None,
        Total_Quantity=data.get('Total_Quantity', 0),
        Cost_Per_Unit=data.get('Cost_Per_Unit', 0)
    )
    db.session.add(new_supply)
    db.session.commit()
    return jsonify(new_supply.to_dict()), 201

@app.route('/supplies/<int:id>', methods=['PUT'])
def update_supply(id):
    supply = Supplies.query.get_or_404(id)
    data = request.json
    supply.Name = data.get('Name', supply.Name)
    supply.Category = data.get('Category', supply.Category)
    supply.Expiry_Date = datetime.strptime(data['Expiry_Date'], '%Y-%m-%d') if data.get('Expiry_Date') else supply.Expiry_Date
    supply.Total_Quantity = data.get('Total_Quantity', supply.Total_Quantity)
    supply.Cost_Per_Unit = data.get('Cost_Per_Unit', supply.Cost_Per_Unit)
    db.session.commit()
    return jsonify(supply.to_dict())

@app.route('/supplies/<int:id>', methods=['DELETE'])
def delete_supply(id):
    supply = Supplies.query.get_or_404(id)
    db.session.delete(supply)
    db.session.commit()
    return '', 204

# -------------------- SUPPLIERS CRUD --------------------
@app.route('/suppliers', methods=['GET'])
def get_suppliers():
    suppliers = Suppliers.query.all()
    return jsonify([s.to_dict() for s in suppliers])

@app.route('/suppliers/<int:id>', methods=['GET'])
def get_supplier(id):
    supplier = Suppliers.query.get_or_404(id)
    return jsonify(supplier.to_dict())

@app.route('/suppliers', methods=['POST'])
def add_supplier():
    data = request.json
    new_supplier = Suppliers(
        Name=data['Name'],
        Contact=data.get('Contact'),
        Lead_Time=data.get('Lead_Time')
    )
    db.session.add(new_supplier)
    db.session.commit()
    return jsonify(new_supplier.to_dict()), 201

@app.route('/suppliers/<int:id>', methods=['PUT'])
def update_supplier(id):
    supplier = Suppliers.query.get_or_404(id)
    data = request.json
    supplier.Name = data.get('Name', supplier.Name)
    supplier.Contact = data.get('Contact', supplier.Contact)
    supplier.Lead_Time = data.get('Lead_Time', supplier.Lead_Time)
    db.session.commit()
    return jsonify(supplier.to_dict())

@app.route('/suppliers/<int:id>', methods=['DELETE'])
def delete_supplier(id):
    supplier = Suppliers.query.get_or_404(id)
    db.session.delete(supplier)
    db.session.commit()
    return '', 204

# -------------------- EXPENSES CRUD --------------------
@app.route('/expenses', methods=['GET'])
def get_expenses():
    expenses = Expenses.query.order_by(Expenses.Date.desc()).all()
    return jsonify([e.to_dict() for e in expenses])

@app.route('/expenses/<int:id>', methods=['GET'])
def get_expense(id):
    expense = Expenses.query.get_or_404(id)
    return jsonify(expense.to_dict())

@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.json
    new_expense = Expenses(
        Date=datetime.strptime(data['Date'], '%Y-%m-%d'),
        Category=data.get('Category'),
        Amount=data.get('Amount', 0)
    )
    db.session.add(new_expense)
    db.session.commit()
    return jsonify(new_expense.to_dict()), 201

@app.route('/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    expense = Expenses.query.get_or_404(id)
    db.session.delete(expense)
    db.session.commit()
    return '', 204

# -------------------- USAGE RECORDS CRUD --------------------
@app.route('/usage_records', methods=['GET'])
def get_usage_records():
    records = UsageRecords.query.order_by(UsageRecords.Date.desc()).all()
    return jsonify([r.to_dict() for r in records])

@app.route('/usage_records/<int:id>', methods=['GET'])
def get_usage_record(id):
    record = UsageRecords.query.get_or_404(id)
    return jsonify(record.to_dict())

@app.route('/usage_records', methods=['POST'])
def add_usage_record():
    data = request.json
    new_record = UsageRecords(
        Date=datetime.strptime(data['Date'], '%Y-%m-%d'),
        Supply_ID=data['Supply_ID'],
        Quantity_Used=data['Quantity_Used'],
        Location=data.get('Location')
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify(new_record.to_dict()), 201

@app.route('/usage_records/<int:id>', methods=['DELETE'])
def delete_usage_record(id):
    record = UsageRecords.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return '', 204

# -------------------- SUPPLY ORDERS CRUD --------------------
@app.route('/supply_orders', methods=['GET'])
def get_supply_orders():
    orders = SupplyOrders.query.order_by(SupplyOrders.Date.desc()).all()
    return jsonify([o.to_dict() for o in orders])

@app.route('/supply_orders', methods=['POST'])
def add_supply_order():
    data = request.json
    new_order = SupplyOrders(
        Date=datetime.strptime(data['Date'], '%Y-%m-%d'),
        Supplier_ID=data['Supplier_ID'],
        Supply_ID=data['Supply_ID'],
        Quantity_Received=data['Quantity_Received'],
        Total_Cost=data['Total_Cost']
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify(new_order.to_dict()), 201

@app.route('/supply_orders/<int:id>', methods=['DELETE'])
def delete_supply_order(id):
    order = SupplyOrders.query.get_or_404(id)
    db.session.delete(order)
    db.session.commit()
    return '', 204

# -------------------- STORE STOCK CRUD --------------------
@app.route('/store_stock', methods=['GET'])
def get_store_stock():
    stock = StoreStock.query.order_by(StoreStock.Last_Updated.desc()).all()
    return jsonify([s.to_dict() for s in stock])

@app.route('/store_stock', methods=['POST'])
def add_store_stock():
    data = request.json
    new_stock = StoreStock(
        Supply_ID=data['Supply_ID'],
        Quantity_Available=data['Quantity_Available'],
        Last_Updated=datetime.strptime(data['Last_Updated'], '%Y-%m-%d %H:%M:%S')
    )
    db.session.add(new_stock)
    db.session.commit()
    return jsonify(new_stock.to_dict()), 201

@app.route('/store_stock/<int:id>', methods=['DELETE'])
def delete_store_stock(id):
    stock = StoreStock.query.get_or_404(id)
    db.session.delete(stock)
    db.session.commit()
    return '', 204

# -------------------- RESTOCK REQUESTS CRUD --------------------
@app.route('/restock_requests', methods=['GET'])
def get_restock_requests():
    requests = RestockRequests.query.order_by(RestockRequests.Date.desc()).all()
    return jsonify([r.to_dict() for r in requests])

@app.route('/restock_requests', methods=['POST'])
def add_restock_request():
    data = request.json
    new_request = RestockRequests(
        Date=datetime.strptime(data['Date'], '%Y-%m-%d'),
        Supply_ID=data['Supply_ID'],
        Quantity_Requested=data['Quantity_Requested'],
        Request_Type=data['Request_Type']
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify(new_request.to_dict()), 201

@app.route('/restock_requests/<int:id>', methods=['DELETE'])
def delete_restock_request(id):
    request_record = RestockRequests.query.get_or_404(id)
    db.session.delete(request_record)
    db.session.commit()
    return '', 204

# -------------------- MARKET PURCHASES CRUD --------------------
@app.route('/market_purchases', methods=['GET'])
def get_market_purchases():
    purchases = MarketPurchases.query.order_by(MarketPurchases.Date.desc()).all()
    return jsonify([p.to_dict() for p in purchases])

@app.route('/market_purchases', methods=['POST'])
def add_market_purchase():
    data = request.json
    new_purchase = MarketPurchases(
        Date=datetime.strptime(data['Date'], '%Y-%m-%d'),
        Item_Name=data['Item_Name'],
        Quantity=data['Quantity'],
        Cost=data['Cost'],
        Category=data['Category']
    )
    db.session.add(new_purchase)
    db.session.commit()
    return jsonify(new_purchase.to_dict()), 201

@app.route('/market_purchases/<int:id>', methods=['DELETE'])
def delete_market_purchase(id):
    purchase = MarketPurchases.query.get_or_404(id)
    db.session.delete(purchase)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
