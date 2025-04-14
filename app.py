from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, Supplies, Suppliers, Expenses, UsageRecords, SupplyOrders, StoreStock, RestockRequests, MarketPurchases
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)

@app.route('/')
def home():
    return "Greatea Inventory API is running."

# ---------- CRUD: Supplies ----------
@app.route('/supplies', methods=['GET'])
def get_supplies():
    return jsonify([s.to_dict() for s in Supplies.query.all()])

@app.route('/supplies/<int:id>', methods=['GET'])
def get_supply(id):
    return jsonify(Supplies.query.get_or_404(id).to_dict())

@app.route('/supplies', methods=['POST'])
def create_supply():
    data = request.json
    new_item = Supplies(
        Name=data['Name'],
        Category=data.get('Category'),
        Expiry_Date=datetime.strptime(data['Expiry_Date'], '%Y-%m-%d') if data.get('Expiry_Date') else None,
        Total_Quantity=data.get('Total_Quantity', 0),
        Cost_Per_Unit=data.get('Cost_Per_Unit', 0)
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/supplies/<int:id>', methods=['DELETE'])
def delete_supply(id):
    item = Supplies.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# ---------- CRUD: Suppliers ----------
@app.route('/suppliers', methods=['GET'])
def get_suppliers():
    return jsonify([s.to_dict() for s in Suppliers.query.all()])

@app.route('/suppliers', methods=['POST'])
def create_supplier():
    data = request.json
    new_item = Suppliers(
        Name=data['Name'],
        Contact=data.get('Contact'),
        Lead_Time=data.get('Lead_Time')
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/suppliers/<int:id>', methods=['DELETE'])
def delete_supplier(id):
    item = Suppliers.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# ---------- CRUD: Expenses ----------
@app.route('/expenses', methods=['GET'])
def get_expenses():
    return jsonify([e.to_dict() for e in Expenses.query.all()])

@app.route('/expenses', methods=['POST'])
def create_expense():
    data = request.json
    new_item = Expenses(
        Date=datetime.strptime(data['Date'], '%Y-%m-%d'),
        Category=data['Category'],
        Amount=data['Amount']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    item = Expenses.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# ---------- CRUD: Usage Records ----------
@app.route('/usage', methods=['GET'])
def get_usage():
    return jsonify([u.to_dict() for u in UsageRecords.query.all()])

@app.route('/usage', methods=['POST'])
def create_usage():
    data = request.json
    new_item = UsageRecords(
        Date=datetime.strptime(data['Date'], '%Y-%m-%d'),
        Supply_ID=data['Supply_ID'],
        Quantity_Used=data['Quantity_Used'],
        Location=data.get('Location')
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/usage/<int:id>', methods=['DELETE'])
def delete_usage(id):
    item = UsageRecords.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# ---------- CRUD: Supply Orders ----------
@app.route('/orders', methods=['GET'])
def get_orders():
    return jsonify([o.to_dict() for o in SupplyOrders.query.all()])

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    new_item = SupplyOrders(
        Date=datetime.strptime(data['Date'], '%Y-%m-%d'),
        Supplier_ID=data['Supplier_ID'],
        Supply_ID=data['Supply_ID'],
        Quantity_Received=data['Quantity_Received'],
        Total_Cost=data['Total_Cost']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    item = SupplyOrders.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# ---------- CRUD: Store Stock ----------
@app.route('/stock', methods=['GET'])
def get_stock():
    return jsonify([s.to_dict() for s in StoreStock.query.all()])

@app.route('/stock', methods=['POST'])
def create_stock():
    data = request.json
    new_item = StoreStock(
        Supply_ID=data['Supply_ID'],
        Quantity_Available=data['Quantity_Available'],
        Last_Updated=datetime.strptime(data['Last_Updated'], '%Y-%m-%dT%H:%M')
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/stock/<int:id>', methods=['DELETE'])
def delete_stock(id):
    item = StoreStock.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# ---------- CRUD: Restock Requests ----------
@app.route('/restocks', methods=['GET'])
def get_restocks():
    return jsonify([r.to_dict() for r in RestockRequests.query.all()])

@app.route('/restocks', methods=['POST'])
def create_restock():
    data = request.json
    new_item = RestockRequests(
        Date=datetime.strptime(data['Date'], '%Y-%m-%d'),
        Supply_ID=data['Supply_ID'],
        Quantity_Requested=data['Quantity_Requested'],
        Request_Type=data['Request_Type']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/restocks/<int:id>', methods=['DELETE'])
def delete_restock(id):
    item = RestockRequests.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# ---------- CRUD: Market Purchases ----------
@app.route('/purchases', methods=['GET'])
def get_purchases():
    return jsonify([p.to_dict() for p in MarketPurchases.query.all()])

@app.route('/purchases', methods=['POST'])
def create_purchase():
    data = request.json
    new_item = MarketPurchases(
        Date=datetime.strptime(data['Date'], '%Y-%m-%d'),
        Item_Name=data['Item_Name'],
        Quantity=data['Quantity'],
        Cost=data['Cost'],
        Category=data['Category']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/purchases/<int:id>', methods=['DELETE'])
def delete_purchase(id):
    item = MarketPurchases.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
