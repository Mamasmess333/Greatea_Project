// ✅ Modular and Complete app.js for Greatea Inventory System

const baseAPI = "http://127.0.0.1:5000";
const endpoints = {
  supply: "supplies",
  supplier: "suppliers",
  usage: "usage_records",
  expense: "expenses",
  order: "supply_orders",
  stock: "store_stock",
  restock: "restock_requests",
  purchase: "market_purchases"
};

// Load everything
window.addEventListener("DOMContentLoaded", () => {
  Object.keys(endpoints).forEach(type => loadList(type));
  updateStats();

  Object.keys(endpoints).forEach(type => {
    const form = document.getElementById(`${type}-form`);
    if (form) form.onsubmit = (e) => handleSubmit(e, type);
  });
});

function handleSubmit(e, type) {
  e.preventDefault();
  const data = collectFormData(type);
  postData(type, data).then(() => {
    document.getElementById(`${type}-form`).reset();
    loadList(type);
    if (type === "supply") updateStats();
  });
}

function collectFormData(type) {
  const fields = {
    supply: ["name", "category", "expiry", "quantity", "cost"],
    supplier: ["supplier-name", "supplier-contact", "supplier-lead"],
    usage: ["usage-date", "usage-supply-id", "usage-qty", "usage-location"],
    expense: ["expense-date", "expense-category", "expense-amount"],
    order: ["order-date", "order-supplier-id", "order-supply-id", "order-qty", "order-cost"],
    stock: ["stock-supply-id", "stock-qty", "stock-date"],
    restock: ["restock-date", "restock-supply-id", "restock-qty", "restock-type"],
    purchase: ["purchase-date", "purchase-item", "purchase-qty", "purchase-cost", "purchase-category"]
  };
  const data = {};
  fields[type].forEach(id => {
    const el = document.getElementById(id);
    if (el) data[el.id.replace(`${type}-`, "").replace("supplier-", "")] = el.value;
  });
  return data;
}

function postData(type, data) {
  return fetch(`${baseAPI}/${endpoints[type]}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

function deleteItem(type, id) {
  fetch(`${baseAPI}/${endpoints[type]}/${id}`, { method: "DELETE" })
    .then(() => loadList(type));
}

function loadList(type) {
  fetch(`${baseAPI}/${endpoints[type]}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById(`${type}-list`);
      if (!list) return;
      list.innerHTML = "";
      data.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = formatCard(type, item);
        list.appendChild(div);
      });
      if (type === "supply") renderChart(
        data.map(i => i.Name),
        data.map(i => i.Total_Quantity)
      );
      if (type === "expense") renderExpenseChart(data);
    });
}

function formatCard(type, item) {
  const card = (content, id) => `
    <div class="card shadow-sm mb-2">
      <div class="card-body">
        ${content}
        <button class="btn btn-sm btn-danger" onclick="deleteItem('${type}', ${id})">Delete</button>
      </div>
    </div>`;

  switch (type) {
    case "supply": return card(`
      <h5 class="card-title">${item.Name}</h5>
      <p><strong>Category:</strong> ${item.Category || "N/A"}<br>
      <strong>Quantity:</strong> ${item.Total_Quantity}<br>
      <strong>Cost:</strong> $${item.Cost_Per_Unit}<br>
      <strong>Expiry:</strong> ${item.Expiry_Date || "N/A"}</p>
    `, item.Supply_ID);
    case "supplier": return card(`
      <h5 class="card-title">${item.Name}</h5>
      <p><strong>Contact:</strong> ${item.Contact || "N/A"}<br>
      <strong>Lead Time:</strong> ${item.Lead_Time || "N/A"} days</p>
    `, item.Supplier_ID);
    case "expense": return card(`
      <p><strong>Date:</strong> ${item.Date}<br>
      <strong>Category:</strong> ${item.Category}<br>
      <strong>Amount:</strong> $${item.Amount}</p>
    `, item.Expense_ID);
    case "usage": return card(`
      <p><strong>Date:</strong> ${item.Date}<br>
      <strong>Supply ID:</strong> ${item.Supply_ID}<br>
      <strong>Quantity:</strong> ${item.Quantity_Used}<br>
      <strong>Location:</strong> ${item.Location}</p>
    `, item.Usage_ID);
    case "order": return card(`
      <p><strong>Date:</strong> ${item.Date}<br>
      <strong>Supplier ID:</strong> ${item.Supplier_ID}<br>
      <strong>Supply ID:</strong> ${item.Supply_ID}<br>
      <strong>Qty Received:</strong> ${item.Quantity_Received}<br>
      <strong>Total Cost:</strong> $${item.Total_Cost}</p>
    `, item.Order_ID);
    case "stock": return card(`
      <p><strong>Supply ID:</strong> ${item.Supply_ID}<br>
      <strong>Quantity Available:</strong> ${item.Quantity_Available}<br>
      <strong>Last Updated:</strong> ${item.Last_Updated}</p>
    `, item.Stock_ID);
    case "restock": return card(`
      <p><strong>Date:</strong> ${item.Date}<br>
      <strong>Supply ID:</strong> ${item.Supply_ID}<br>
      <strong>Quantity:</strong> ${item.Quantity_Requested}<br>
      <strong>Type:</strong> ${item.Request_Type}</p>
    `, item.Request_ID);
    case "purchase": return card(`
      <p><strong>Date:</strong> ${item.Date}<br>
      <strong>Item:</strong> ${item.Item_Name}<br>
      <strong>Qty:</strong> ${item.Quantity}<br>
      <strong>Cost:</strong> $${item.Cost}<br>
      <strong>Category:</strong> ${item.Category}</p>
    `, item.Purchase_ID);
    default: return "";
  }
}

// Inventory Summary
function updateStats() {
  fetch(`${baseAPI}/${endpoints.supply}`)
    .then(res => res.json())
    .then(supplies => {
      const totalItems = supplies.length;
      const totalUnits = supplies.reduce((sum, s) => sum + s.Total_Quantity, 0);
      const totalValue = supplies.reduce((sum, s) => sum + s.Total_Quantity * s.Cost_Per_Unit, 0);

      document.getElementById("summary").innerHTML = `
        <div class="alert alert-info">
          <strong>Inventory Summary:</strong><br>
          Items: ${totalItems} | Total Units: ${totalUnits.toFixed(2)} | Value: $${totalValue.toFixed(2)}
        </div>`;
    });
}

function renderChart(labels, data) {
  const ctx = document.getElementById("inventory-chart").getContext("2d");
  if (window.bar) window.bar.destroy();
  window.bar = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Quantity of Supplies",
        data: data,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, title: { display: true, text: "Inventory Stock Levels" } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderExpenseChart(data) {
  const grouped = {};
  data.forEach(e => grouped[e.Category] = (grouped[e.Category] || 0) + e.Amount);
  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  const ctx = document.getElementById("expense-chart").getContext("2d");
  if (window.expenseChart) window.expenseChart.destroy();
  window.expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        label: "Expenses",
        data: values,
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Expense Breakdown by Category"
        }
      }
    }
  });
}
