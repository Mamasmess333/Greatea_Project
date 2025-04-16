const API = "http://127.0.0.1:5000";
let inventoryChart = null, expenseChart = null, trendChart = null;

window.addEventListener("DOMContentLoaded", () => {
  // Load basic data
  loadSupplies();
  loadSuppliers();
  loadExpenses();
  loadUsageRecords();
  loadSupplyOrders();
  loadStoreStock();
  loadRestockRequests();
  loadMarketPurchases();
  
  // Load advanced data
  loadDashboardSummary();
  loadExpiringItems();
  loadStockAlerts();
  loadSpendingTrends();
  
  // Populate dropdowns
  populateDropdowns();
  
  // Set form event listeners
  document.getElementById("supply-form").addEventListener("submit", handleAddSupply);
  document.getElementById("supplier-form").addEventListener("submit", handleAddSupplier);
  document.getElementById("expense-form").addEventListener("submit", handleAddExpense);
  document.getElementById("usage-form").addEventListener("submit", handleAddUsage);
  document.getElementById("order-form").addEventListener("submit", handleAddOrder);
  document.getElementById("stock-form").addEventListener("submit", handleAddStock);
  document.getElementById("restock-form").addEventListener("submit", handleAddRestock);
  document.getElementById("purchase-form").addEventListener("submit", handleAddPurchase);
  
  // Set today's date as default for date inputs
  setDefaultDates();
});

function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    if (!input.value) input.value = today;
  });
  
  const now = new Date().toISOString().slice(0, 16);
  document.querySelectorAll('input[type="datetime-local"]').forEach(input => {
    if (!input.value) input.value = now;
  });
}

function populateDropdowns() {
  // Populate supply dropdowns
  fetch(`${API}/supplies`)
    .then(res => res.json())
    .then(data => {
      const supplies = Array.isArray(data) ? data : (data.items || []);
      ["usage-supply-id", "order-supply-id", "stock-supply-id", "restock-supply-id"]
        .forEach(id => {
          const select = document.getElementById(id);
          if (select) {
            select.innerHTML = "<option value=''>Select a supply</option>";
            supplies.forEach(s => {
              select.innerHTML += `<option value="${s.Supply_ID}">${s.Name} (ID: ${s.Supply_ID})</option>`;
            });
          }
        });
    });
  
  // Populate supplier dropdowns
  fetch(`${API}/suppliers`)
    .then(res => res.json())
    .then(data => {
      const suppliers = Array.isArray(data) ? data : (data.items || []);
      const select = document.getElementById("order-supplier-id");
      if (select) {
        select.innerHTML = "<option value=''>Select a supplier</option>";
        suppliers.forEach(s => {
          select.innerHTML += `<option value="${s.Supplier_ID}">${s.Name} (ID: ${s.Supplier_ID})</option>`;
        });
      }
    });
}

function fetchList(endpoint, elementId, builder, chartCallback = null) {
  fetch(`${API}/${endpoint}`)
    .then(res => res.json())
    .then(data => {
      const items = Array.isArray(data) ? data : (data.items || []);
      const el = document.getElementById(elementId);
      if (el) {
        el.innerHTML = "";
        items.forEach(item => el.innerHTML += builder(item));
        if (chartCallback) chartCallback(items);
      }
    })
    .catch(err => console.error(`Error fetching ${endpoint}:`, err));
}

function postData(endpoint, payload, formId, callback) {
  fetch(`${API}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.error || `HTTP error! Status: ${response.status}`);
      });
    }
    return response.json();
  })
  .then(() => {
    document.getElementById(formId).reset();
    setDefaultDates();
    showToast("Success", `${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)} added successfully.`);
    callback();
  })
  .catch(err => {
    console.error(`Error posting to ${endpoint}:`, err);
    showToast("Error", err.message, "error");
  });
}

function deleteItem(endpoint, id, callback) {
  if (confirm("Are you sure you want to delete this item?")) {
    fetch(`${API}/${endpoint}/${id}`, { method: "DELETE" })
      .then(response => {
        if (response.ok) {
          showToast("Success", "Item deleted successfully.");
          callback();
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      })
      .catch(err => {
        console.error(`Error deleting from ${endpoint}:`, err);
        showToast("Error", err.message, "error");
      });
  }
}

function showToast(title, message, type = "success") {
  const toastContainer = document.getElementById("toast-container") || (() => {
    const container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(container);
    return container;
  })();
  
  const toastId = `toast-${Date.now()}`;
  const bgClass = type === "success" ? "bg-success" : "bg-danger";
  
  toastContainer.innerHTML += `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header ${bgClass} text-white">
        <strong class="me-auto">${title}</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">${message}</div>
    </div>
  `;
  
  const toastElement = new bootstrap.Toast(document.getElementById(toastId));
  toastElement.show();
  
  document.getElementById(toastId).addEventListener('hidden.bs.toast', function() {
    this.remove();
  });
}

// CRUD Handlers
function handleAddSupply(e) {
  e.preventDefault();
  postData("supplies", {
    Name: document.getElementById("name").value,
    Category: document.getElementById("category").value,
    Expiry_Date: document.getElementById("expiry").value,
    Total_Quantity: parseFloat(document.getElementById("quantity").value),
    Cost_Per_Unit: parseFloat(document.getElementById("cost").value)
  }, "supply-form", () => {
    loadSupplies();
    populateDropdowns();
    updateStats();
  });
}

function handleAddSupplier(e) {
  e.preventDefault();
  postData("suppliers", {
    Name: document.getElementById("supplier-name").value,
    Contact: document.getElementById("supplier-contact").value,
    Lead_Time: parseInt(document.getElementById("supplier-lead").value)
  }, "supplier-form", () => {
    loadSuppliers();
    populateDropdowns();
  });
}

function handleAddExpense(e) {
  e.preventDefault();
  postData("expenses", {
    Date: document.getElementById("expense-date").value,
    Category: document.getElementById("expense-category").value,
    Amount: parseFloat(document.getElementById("expense-amount").value)
  }, "expense-form", () => {
    loadExpenses();
    loadSpendingTrends();
    loadDashboardSummary();
  });
}

function handleAddUsage(e) {
  e.preventDefault();
  postData("usage", {
    Date: document.getElementById("usage-date").value,
    Supply_ID: parseInt(document.getElementById("usage-supply-id").value),
    Quantity_Used: parseFloat(document.getElementById("usage-qty").value),
    Location: document.getElementById("usage-location").value
  }, "usage-form", () => {
    loadUsageRecords();
    loadStockAlerts();
    loadSupplies();
    loadStoreStock();
  });
}

function handleAddOrder(e) {
  e.preventDefault();
  postData("orders", {
    Date: document.getElementById("order-date").value,
    Supplier_ID: parseInt(document.getElementById("order-supplier-id").value),
    Supply_ID: parseInt(document.getElementById("order-supply-id").value),
    Quantity_Received: parseFloat(document.getElementById("order-qty").value),
    Total_Cost: parseFloat(document.getElementById("order-cost").value)
  }, "order-form", () => {
    loadSupplyOrders();
    loadSupplies();
    loadExpenses();
  });
}

function handleAddStock(e) {
  e.preventDefault();
  postData("stock", {
    Supply_ID: parseInt(document.getElementById("stock-supply-id").value),
    Quantity_Available: parseFloat(document.getElementById("stock-qty").value),
    Last_Updated: document.getElementById("stock-date").value
  }, "stock-form", () => {
    loadStoreStock();
    loadStockAlerts();
  });
}

function handleAddRestock(e) {
  e.preventDefault();
  postData("restocks", {
    Date: document.getElementById("restock-date").value,
    Supply_ID: parseInt(document.getElementById("restock-supply-id").value),
    Quantity_Requested: parseFloat(document.getElementById("restock-qty").value),
    Request_Type: document.getElementById("restock-type").value
  }, "restock-form", () => {
    loadRestockRequests();
    loadDashboardSummary();
  });
}

function handleAddPurchase(e) {
  e.preventDefault();
  postData("purchases", {
    Date: document.getElementById("purchase-date").value,
    Item_Name: document.getElementById("purchase-item").value,
    Quantity: parseFloat(document.getElementById("purchase-qty").value),
    Cost: parseFloat(document.getElementById("purchase-cost").value),
    Category: document.getElementById("purchase-category").value
  }, "purchase-form", () => {
    loadMarketPurchases();
    loadExpenses();
    loadSpendingTrends();
  });
}

// Data Loading Functions
function loadSupplies() {
  fetchList("supplies", "supply-list", s => `
    <div class='card shadow-sm mb-2'>
      <div class='card-body'>
        <h5>${s.Name}</h5>
        <p>
          Category: ${s.Category || 'N/A'}<br>
          Quantity: ${s.Total_Quantity || 0}<br>
          Cost: $${s.Cost_Per_Unit || 0}<br>
          Expiry: ${s.Expiry_Date || 'N/A'}
        </p>
        <button class='btn btn-sm btn-danger' onclick="deleteItem('supplies', ${s.Supply_ID}, loadSupplies)">Delete</button>
      </div>
    </div>`, 
    data => {
      const sortedData = [...data].sort((a, b) => b.Total_Quantity - a.Total_Quantity).slice(0, 10);
      renderChart("inventory-chart", 
        sortedData.map(s => s.Name), 
        sortedData.map(s => s.Total_Quantity || 0), 
        "Top 10 Inventory Quantities");
      updateStats();
    }
  );
}

function loadSuppliers() {
  fetchList("suppliers", "supplier-list", s => `
    <div class='card shadow-sm mb-2'>
      <div class='card-body'>
        <h5>${s.Name}</h5>
        <p>
          Contact: ${s.Contact || 'N/A'}<br>
          Lead Time: ${s.Lead_Time || 'N/A'} days
        </p>
        <button class='btn btn-sm btn-danger' onclick="deleteItem('suppliers', ${s.Supplier_ID}, loadSuppliers)">Delete</button>
      </div>
    </div>`
  );
}

function loadExpenses() {
  fetchList("expenses", "expense-list", e => `
    <div class='card shadow-sm mb-2'>
      <div class='card-body'>
        <strong>${e.Category || 'Uncategorized'}</strong> - $${e.Amount || 0} (${e.Date || 'N/A'})
        <button class='btn btn-sm btn-danger float-end' onclick="deleteItem('expenses', ${e.Expense_ID}, loadExpenses)">Delete</button>
      </div>
    </div>`,
    data => {
      const grouped = data.reduce((acc, e) => {
        const category = e.Category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + (e.Amount || 0);
        return acc;
      }, {});
      
      renderChart("expense-chart", 
        Object.keys(grouped), 
        Object.values(grouped), 
        "Expenses by Category", 
        'pie', 
        [
          'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'
        ]
      );
    }
  );
}

function loadUsageRecords() {
  fetchList("usage", "usage-list", u => `
    <div class='card shadow-sm mb-2'>
      <div class='card-body'>
        Date: ${u.Date || 'N/A'}, 
        Supply: ${u.Supply_Name || `ID: ${u.Supply_ID}` || 'N/A'}, 
        Qty: ${u.Quantity_Used || 0}, 
        Location: ${u.Location || 'N/A'}
        <button class='btn btn-sm btn-danger float-end' onclick="deleteItem('usage', ${u.Usage_ID}, loadUsageRecords)">Delete</button>
      </div>
    </div>`
  );
}

function loadSupplyOrders() {
  fetchList("orders", "order-list", o => `
    <div class='card shadow-sm mb-2'>
      <div class='card-body'>
        Date: ${o.Date || 'N/A'}, 
        Supplier: ${o.Supplier_Name || `ID: ${o.Supplier_ID}` || 'N/A'}, 
        Supply: ${o.Supply_Name || `ID: ${o.Supply_ID}` || 'N/A'}, 
        Qty: ${o.Quantity_Received || 0}, 
        Cost: $${o.Total_Cost || 0}
        <button class='btn btn-sm btn-danger float-end' onclick="deleteItem('orders', ${o.Order_ID}, loadSupplyOrders)">Delete</button>
      </div>
    </div>`
  );
}

function loadStoreStock() {
  fetchList("stock", "stock-list", s => `
    <div class='card shadow-sm mb-2'>
      <div class='card-body'>
        Supply: ${s.Supply_Name || `ID: ${s.Supply_ID}` || 'N/A'}, 
        Qty Available: ${s.Quantity_Available || 0}, 
        Last Updated: ${s.Last_Updated ? new Date(s.Last_Updated).toLocaleString() : 'N/A'}
        <button class='btn btn-sm btn-danger float-end' onclick="deleteItem('stock', ${s.Stock_ID}, loadStoreStock)">Delete</button>
      </div>
    </div>`
  );
}

function loadRestockRequests() {
  fetchList("restocks", "restock-list", r => `
    <div class='card shadow-sm mb-2'>
      <div class='card-body'>
        Date: ${r.Date || 'N/A'}, 
        Supply: ${r.Supply_Name || `ID: ${r.Supply_ID}` || 'N/A'}, 
        Qty: ${r.Quantity_Requested || 0}, 
        Type: ${r.Request_Type || 'N/A'}
        <button class='btn btn-sm btn-danger float-end' onclick="deleteItem('restocks', ${r.Request_ID}, loadRestockRequests)">Delete</button>
      </div>
    </div>`
  );
}

function loadMarketPurchases() {
  fetchList("purchases", "purchase-list", p => `
    <div class='card shadow-sm mb-2'>
      <div class='card-body'>
        ${p.Item_Name || 'Unnamed Item'} (${p.Category || 'Uncategorized'}) - 
        Qty: ${p.Quantity || 0} | 
        Cost: $${p.Cost || 0} | 
        ${p.Date || 'N/A'}
        <button class='btn btn-sm btn-danger float-end' onclick="deleteItem('purchases', ${p.Purchase_ID}, loadMarketPurchases)">Delete</button>
      </div>
    </div>`
  );
}

// Advanced Functions
function updateStats() {
  fetch(`${API}/supplies`)
    .then(res => res.json())
    .then(data => {
      const items = Array.isArray(data) ? data : (data.items || []);
      const totalItems = items.length;
      const totalUnits = items.reduce((sum, s) => sum + (s.Total_Quantity || 0), 0);
      const totalValue = items.reduce((sum, s) => sum + ((s.Total_Quantity || 0) * (s.Cost_Per_Unit || 0)), 0);
      document.getElementById("summary").innerHTML = `
        <div class="alert alert-info">
          Items: ${totalItems}, 
          Units: ${totalUnits.toFixed(2)}, 
          Value: $${totalValue.toFixed(2)}
        </div>`;
    });
}

function loadDashboardSummary() {
  fetch(`${API}/dashboard/summary`)
    .then(res => res.json())
    .then(data => {
      if (data.error) return;
      
      // Update dashboard stats
      if (document.getElementById("dashboard-stats")) {
        document.getElementById("dashboard-stats").innerHTML = `
          <div class="row">
            <div class="col-md-3 mb-3">
              <div class="card text-white bg-danger">
                <div class="card-body text-center">
                  <h2>${data.low_stock_count}</h2>
                  <p class="mb-0">Low Stock Items</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-white bg-warning">
                <div class="card-body text-center">
                  <h2>${data.expiring_soon_count}</h2>
                  <p class="mb-0">Expiring Soon</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-white bg-primary">
                <div class="card-body text-center">
                  <h2>${data.pending_restocks}</h2>
                  <p class="mb-0">Pending Restocks</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-white bg-success">
                <div class="card-body text-center">
                  <h2>$${data.inventory_value.toFixed(2)}</h2>
                  <p class="mb-0">Inventory Value</p>
                </div>
              </div>
            </div>
          </div>`;
      }
    });
}

function loadExpiringItems() {
  fetch(`${API}/analytics/expiring-soon`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("expiring-items");
      if (!container) return;
      
      if (data.error || data.length === 0) {
        container.innerHTML = data.error 
          ? `<div class="alert alert-danger">${data.error}</div>`
          : `<div class="alert alert-success">No items expiring soon.</div>`;
        return;
      }
      
      data.sort((a, b) => a.days_until_expiry - b.days_until_expiry);
      
      let html = `
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>Name</th><th>Category</th><th>Expiry Date</th>
                <th>Days Left</th><th>Current Stock</th><th>Priority</th>
              </tr>
            </thead>
            <tbody>`;
      
      data.forEach(item => {
        const priorityClass = 
          item.priority === "High" ? "bg-danger text-white" : 
          item.priority === "Medium" ? "bg-warning" : "bg-info";
        
        html += `
          <tr>
            <td>${item.Name}</td>
            <td>${item.Category || 'N/A'}</td>
            <td>${item.Expiry_Date}</td>
            <td>${item.days_until_expiry}</td>
            <td>${item.current_stock}</td>
            <td><span class="badge ${priorityClass}">${item.priority}</span></td>
          </tr>`;
      });
      
      html += `</tbody></table></div>`;
      container.innerHTML = html;
    });
}

function loadStockAlerts() {
  fetch(`${API}/analytics/stock-alerts`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("stock-alerts");
      if (!container) return;
      
      if (data.error || data.length === 0) {
        container.innerHTML = data.error 
          ? `<div class="alert alert-danger">${data.error}</div>`
          : `<div class="alert alert-success">No stock alerts at this time.</div>`;
        return;
      }
      
      let html = `
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>Name</th><th>Category</th><th>Current Stock</th>
                <th>Daily Usage</th><th>Days Remaining</th><th>Status</th>
              </tr>
            </thead>
            <tbody>`;
      
      data.forEach(item => {
        const statusClass = 
          item.Status === "Critical" ? "bg-danger text-white" : 
          item.Status === "Warning" ? "bg-warning" : "bg-info";
        
        html += `
          <tr>
            <td>${item.Name}</td>
            <td>${item.Category || 'N/A'}</td>
            <td>${item.Current_Stock}</td>
            <td>${item.Daily_Usage}</td>
            <td>${item.Days_Remaining}</td>
            <td><span class="badge ${statusClass}">${item.Status}</span></td>
          </tr>`;
      });
      
      html += `</tbody></table></div>`;
      container.innerHTML = html;
    });
}

function loadSpendingTrends() {
  fetch(`${API}/analytics/spending-trends`)
    .then(res => res.json())
    .then(data => {
      if (data.error || !data.trends) return;
      
      const trends = data.trends;
      const categories = data.categories || [];
      
      if (trends.length === 0 || !document.getElementById("spending-trends-chart")) return;
      
      // Prepare chart data
      const labels = trends.map(item => item.date);
      const datasets = categories.map(category => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        
        return {
          label: category,
          data: trends.map(item => item[category] || 0),
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.7)`,
          borderColor: `rgba(${r}, ${g}, ${b}, 1)`,
          borderWidth: 1,
          fill: false
        };
      });
      
      // Render chart
      const ctx = document.getElementById("spending-trends-chart");
      if (trendChart) trendChart.destroy();
      
      trendChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount ($)' }
            },
            x: {
              title: { display: true, text: 'Date' }
            }
          },
          plugins: {
            title: { display: true, text: 'Spending Trends by Category' },
            legend: { position: 'top' }
          }
        }
      });
    });
}

function renderChart(canvasId, labels, data, title, chartType = 'bar', backgroundColor = 'rgba(54, 162, 235, 0.6)') {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  
  const chartConfig = {
    type: chartType,
    data: { 
      labels, 
      datasets: [{ 
        label: title, 
        data, 
        backgroundColor, 
        borderColor: Array.isArray(backgroundColor) 
          ? backgroundColor.map(color => color.replace('0.6', '1')) 
          : backgroundColor.replace('0.6', '1'), 
        borderWidth: 1 
      }] 
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: true }, 
        title: { display: true, text: title } 
      }, 
      scales: { y: { beginAtZero: true } } 
    }
  };
  
  if (window[canvasId + 'Chart']) window[canvasId + 'Chart'].destroy();
  window[canvasId + 'Chart'] = new Chart(ctx, chartConfig);
}
