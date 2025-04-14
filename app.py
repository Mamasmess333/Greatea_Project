from flask_cors import CORS
from flask import Flask, request, jsonify
from config import Config
from models import db, Supplies, Suppliers
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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

