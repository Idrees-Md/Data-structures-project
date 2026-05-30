// ================= DATA =================
let salesList = JSON.parse(localStorage.getItem("sales")) || [];
let undoStack = [];
let queueData = [];
let salesHash = {};
let chart;

// rebuild hash
salesList.forEach(s => salesHash[s.date] = s.amount);

// ================= SAVE =================
function saveData() {
    localStorage.setItem("sales", JSON.stringify(salesList));
}

// ================= ADD =================
function addSale() {
    let date = document.getElementById("date").value;
    let amount = parseFloat(document.getElementById("amount").value);

    if (!date || isNaN(amount)) {
        alert("Enter valid data");
        return;
    }

    let record = { date, amount };

    salesList.unshift(record);
    salesHash[date] = amount;
    queueData.push(record);

    saveData();
    updateUI();
}

// ================= DELETE =================
function deleteSale() {
    if (!salesList.length) {
        alert("No data");
        return;
    }

    let removed = salesList.shift();
    undoStack.push(removed);

    saveData();
    updateUI();
}

// ================= UNDO =================
function undoDelete() {
    if (!undoStack.length) {
        alert("Nothing to undo");
        return;
    }

    let record = undoStack.pop();
    salesList.unshift(record);

    updateUI();
}

// ================= SEARCH =================
function searchSale() {
    let date = document.getElementById("searchDate").value;

    if (salesHash[date] !== undefined) {
        alert("Found ₹" + salesHash[date]);
    } else {
        alert("Not found");
    }
}

// ================= QUEUE =================
function processQueueData() {
    if (!queueData.length) {
        alert("Queue empty");
        return;
    }

    let result = "";

    while (queueData.length) {
        let r = queueData.shift();
        result += `Processed ₹${r.amount}\n`;
    }

    alert(result);
}

// ================= FORECAST =================
function forecast() {
    if (salesList.length < 3) {
        alert("Need at least 3 records");
        return;
    }

    let avg = (
        salesList[0].amount +
        salesList[1].amount +
        salesList[2].amount
    ) / 3;

    alert("Predicted next sale: ₹" + avg.toFixed(2));
}

// ================= UI =================
function updateUI() {
    let table = document.getElementById("tableBody");
    table.innerHTML = "";

    let total = 0;

    salesList.forEach(s => {
        total += s.amount;

        table.innerHTML += `
            <tr>
                <td>${s.date}</td>
                <td>₹${s.amount}</td>
            </tr>`;
    });

    document.getElementById("total").innerText = total.toFixed(2);
    document.getElementById("avg").innerText =
        (salesList.length ? total / salesList.length : 0).toFixed(2);

    drawChart();
}

// ================= CHART =================
function drawChart() {
    let ctx = document.getElementById("chart");

    let labels = salesList.map(s => s.date).reverse();
    let data = salesList.map(s => s.amount).reverse();

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Sales Trend",
                data: data,
                borderWidth: 2
            }]
        }
    });
}

// ================= INIT =================
updateUI();
