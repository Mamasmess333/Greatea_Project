from app import db, app
from models import Supplies
from datetime import datetime

sample_supplies = [
    Supplies(Name="Green Tea", Category="Tea", Expiry_Date=datetime(2025, 6, 30), Total_Quantity=50, Cost_Per_Unit=2.50),
    Supplies(Name="Boba Pearls", Category="Toppings", Expiry_Date=datetime(2025, 4, 10), Total_Quantity=30, Cost_Per_Unit=1.25),
    Supplies(Name="Milk", Category="Dairy", Expiry_Date=datetime(2025, 3, 15), Total_Quantity=20, Cost_Per_Unit=3.00)
]

with app.app_context():
    db.create_all()
    db.session.bulk_save_objects(sample_supplies)
    db.session.commit()
    print("✅ Sample supplies added to the database.")
