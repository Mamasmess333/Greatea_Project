const suppliesAPI = "http://127.0.0.1:5000/supplies";
const suppliersAPI = "http://127.0.0.1:5000/suppliers";

// Load everything on page load
document.addEventListener("DOMContentLoaded", () => {
  loadSupplies();
  loadSuppliers();
  updateStats();

  document.getElementById("supply-form").addEventListener("submit", (e) => {
    e.preventDefault();
    addSupply();
  });

  document.getElementById("supplier-form").addEventListener("submit", (e) => {
    e.preventDefault();
    addSupplier();
  });
});

// -------------------- Supplies --------------------
function loadSupplies() {
  fetch(suppliesAPI)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("supply-list");
      list.innerHTML = "";
      const chartLabels = [], chartData = [];

      data.forEach(s => {
        chartLabels.push(s.Name);
        chartData.push(s.Total_Quantity);

        const div = document.createElement("div");
        div.innerHTML = `
          <div class="card shadow-sm mb-2">
            <div class="card-body">
              <h5 class="card-title">${s.Name}</h5>
              <p class="card-text mb-1">
                <strong>Category:</strong> ${s.Category || "N/A"}<br>
                <strong>Quantity:</strong> ${s.Total_Quantity} units<br>
                <strong>Cost per Unit:</strong> $${s.Cost_Per_Unit}<br>
                <strong>Expires:</strong> ${s.Expiry_Date || "N/A"}
              </p>
              <button class="btn btn-sm btn-danger" onclick="deleteSupply(${s.Supply_ID})">Delete</button>
            </div>
          </div>
        `;
        list.appendChild(div);
      });
      updateStats(data);
      renderChart(chartLabels, chartData);
    });
}

function addSupply() {
  const supply = {
    Name: document.getElementById("name").value,
    Category: document.getElementById("category").value,
    Expiry_Date: document.getElementById("expiry").value,
    Total_Quantity: parseFloat(document.getElementById("quantity").value),
    Cost_Per_Unit: parseFloat(document.getElementById("cost").value)
  };

  fetch(suppliesAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supply)
  }).then(() => {
    document.getElementById("supply-form").reset();
    loadSupplies();
  });
}

function deleteSupply(id) {
  fetch(`${suppliesAPI}/${id}`, { method: "DELETE" })
    .then(() => loadSupplies());
}

// -------------------- Suppliers --------------------
function loadSuppliers() {
  fetch(suppliersAPI)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("supplier-list");
      list.innerHTML = "";
      data.forEach(s => {
        const div = document.createElement("div");
        div.innerHTML = `
          <div class="card shadow-sm mb-2">
            <div class="card-body">
              <h5 class="card-title">${s.Name}</h5>
              <p class="card-text mb-1">
                <strong>Contact:</strong> ${s.Contact || "N/A"}<br>
                <strong>Lead Time:</strong> ${s.Lead_Time || "N/A"} days
              </p>
              <button class="btn btn-sm btn-danger" onclick="deleteSupplier(${s.Supplier_ID})">Delete</button>
            </div>
          </div>
        `;
        list.appendChild(div);
      });
    });
}

function addSupplier() {
  const supplier = {
    Name: document.getElementById("supplier-name").value,
    Contact: document.getElementById("supplier-contact").value,
    Lead_Time: parseInt(document.getElementById("supplier-lead").value)
  };

  fetch(suppliersAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supplier)
  }).then(() => {
    document.getElementById("supplier-form").reset();
    loadSuppliers();
  });
}

function deleteSupplier(id) {
  fetch(`${suppliersAPI}/${id}`, { method: "DELETE" })
    .then(() => loadSuppliers());
}

// -------------------- Stats Summary --------------------
function updateStats(supplies = []) {
  if (supplies.length === 0) {
    fetch(suppliesAPI)
      .then(res => res.json())
      .then(data => updateStats(data));
    return;
  }

  const totalItems = supplies.length;
  const totalUnits = supplies.reduce((sum, s) => sum + s.Total_Quantity, 0);
  const totalValue = supplies.reduce((sum, s) => sum + (s.Total_Quantity * s.Cost_Per_Unit), 0);

  document.getElementById("summary").innerHTML = `
    <div class="alert alert-info">
      <strong>Inventory Summary:</strong><br>
      Items: ${totalItems} | Total Units: ${totalUnits.toFixed(2)} | Value: $${totalValue.toFixed(2)}
    </div>
  `;
}

// -------------------- Chart Rendering --------------------
function renderChart(labels, data) {
  const ctx = document.getElementById("inventory-chart").getContext("2d");
  if (window.bar) window.bar.destroy(); // reset chart if exists
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
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Inventory Stock Levels" }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}
