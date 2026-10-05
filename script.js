const dateInput = document.getElementById("date");
const feeInput = document.getElementById("feeAmount");
const submittedInput = document.getElementById("dueAmount");
const externalInput = document.getElementById("externalCharge");

dateInput.valueAsDate = new Date();

function money(value) {
    return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getAmounts() {
    const fee = Math.max(Number(feeInput.value) || 0, 0);
    const submitted = Math.max(Number(submittedInput.value) || 0, 0);
    const external = Math.max(Number(externalInput.value) || 0, 0);
    const total = fee + external;
    const pending = Math.max(total - submitted, 0);
    return { fee, submitted, external, total, pending };
}

function updateLiveSummary() {
    const { submitted, total, pending } = getAmounts();
    document.getElementById("liveTotal").textContent = `₹${money(total)}`;
    document.getElementById("liveSubmitted").textContent = `₹${money(submitted)}`;
    document.getElementById("livePending").textContent = `₹${money(pending)}`;
}

[feeInput, submittedInput, externalInput].forEach(input => input.addEventListener("input", updateLiveSummary));
updateLiveSummary();

function generateSlip() {
    const name = document.getElementById("studentName").value.trim();
    const roll = document.getElementById("rollNo").value.trim();
    const date = dateInput.value;
    const amounts = getAmounts();

    if (!name) return alert("Please enter student's name.");
    if (!roll) return alert("Please enter roll number.");
    if (amounts.fee <= 0) return alert("Please enter the total fee amount.");
    if (amounts.submitted > amounts.total) return alert("Submitted fee cannot be greater than the total payable amount.");

    document.getElementById("showName").textContent = name;
    document.getElementById("showRoll").textContent = roll;

    if (date) {
        const [year, month, day] = date.split("-");
        document.getElementById("showDate").textContent = `${day}/${month}/${year}`;
    } else {
        document.getElementById("showDate").textContent = "-";
    }

    document.getElementById("showFee").textContent = money(amounts.fee);
    document.getElementById("showExternal").textContent = money(amounts.external);
    document.getElementById("showTotal").textContent = money(amounts.total);
    document.getElementById("showSubmitted").textContent = money(amounts.submitted);
    document.getElementById("showPending").textContent = money(amounts.pending);
    document.getElementById("summarySubmitted").textContent = `₹${money(amounts.submitted)}`;
    document.getElementById("summaryPending").textContent = `₹${money(amounts.pending)}`;

    const badge = document.getElementById("statusBadge");
    if (amounts.pending === 0) {
        badge.textContent = "FULLY PAID";
        badge.classList.add("fully-paid");
    } else {
        badge.textContent = "PAYMENT RECEIVED";
        badge.classList.remove("fully-paid");
    }

    document.getElementById("feesSlip").style.display = "block";
    document.getElementById("printButton").style.display = "block";
    document.getElementById("feesSlip").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetForm() {
    document.getElementById("studentName").value = "";
    document.getElementById("rollNo").value = "";
    feeInput.value = "";
    submittedInput.value = "";
    externalInput.value = "";
    dateInput.valueAsDate = new Date();
    document.getElementById("feesSlip").style.display = "none";
    document.getElementById("printButton").style.display = "none";
    updateLiveSummary();
}
