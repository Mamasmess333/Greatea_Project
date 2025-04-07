from flask_cors import CORS               # ✅ STEP 1: Add this
from flask import Flask, request, jsonify
from config import Config
from models import db, Supplies
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)                                 # ✅ STEP 2: Add this directly after app init
db.init_app(app)

@app.route('/')
def home():
    return "Welcome to Greatea Inventory API"

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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
