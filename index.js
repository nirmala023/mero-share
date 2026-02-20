// index.js
import { logout } from "./auth.js";

const API_URL = "https://ipo.dhakalnishan.com.np/accounts.json";

const gridEl = document.getElementById("grid");
const toastEl = document.getElementById("toast");

let allData = [];

function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), 1200);
}

window.copyText = async function (text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast("Copied");
    } catch (e) {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast("Copied");
    }
}

function safeValue(v) {
    if (v === null || v === undefined || String(v).trim() === "") {
        return { text: "empty", empty: true };
    }
    return { text: String(v), empty: false };
}

function render(data) {
    if (!gridEl) return;
    gridEl.innerHTML = "";

    if (!data.length) {
        return;
    }

    const isMobile = window.innerWidth <= 768;

    for (let i = 0; i < data.length; i++) {
        const item = data[i];

        if (isMobile) {
            // Mobile: Use Bootstrap Accordion
            const card = document.createElement("div");
            card.className = "card accordion-item";

            const header = document.createElement("h2");
            header.className = "accordion-header";
            header.id = `heading${i}`;

            const button = document.createElement("button");
            button.className = "accordion-button collapsed";
            button.type = "button";
            button.setAttribute("data-bs-toggle", "collapse");
            button.setAttribute("data-bs-target", `#collapse${i}`);
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", `collapse${i}`);
            button.textContent = item.name || "Unnamed";

            header.appendChild(button);

            const collapseDiv = document.createElement("div");
            collapseDiv.id = `collapse${i}`;
            collapseDiv.className = "accordion-collapse collapse";
            collapseDiv.setAttribute("aria-labelledby", `heading${i}`);

            const body = document.createElement("div");
            body.className = "accordion-body";

            const rows = document.createElement("div");
            rows.className = "rows";

            const fields = [
                ["dp_id", "DP ID"],
                ["login_id", "Login ID"],
                ["key", "Key"],
                ["account_number", "Account Number"],
                ["crn", "CRN"],
                ["boid", "BOID"]
            ];

            for (const [key, label] of fields) {
                const row = document.createElement("div");
                row.className = "row";

                const lab = document.createElement("div");
                lab.className = "label";
                lab.textContent = label;

                const valObj = safeValue(item[key]);
                const val = document.createElement("div");
                val.className = "value" + (valObj.empty ? " empty" : "");
                val.textContent = valObj.text;

                const btn = document.createElement("button");
                btn.className = "btn";
                btn.textContent = "Copy";
                btn.onclick = () => window.copyText(valObj.empty ? "" : String(item[key]));

                row.appendChild(lab);
                row.appendChild(val);
                row.appendChild(btn);

                rows.appendChild(row);
            }

            body.appendChild(rows);
            collapseDiv.appendChild(body);
            card.appendChild(header);
            card.appendChild(collapseDiv);
            gridEl.appendChild(card);
        } else {
            // Desktop: Show only name, click to open modal
            const card = document.createElement("div");
            card.className = "card";
            card.style.textAlign = "center";
            card.style.padding = "20px";

            const name = document.createElement("h3");
            name.className = "name";
            name.textContent = item.name || "Unnamed";
            name.style.margin = "0";

            card.appendChild(name);

            // Click to open modal
            card.addEventListener("click", () => openModal(item));

            gridEl.appendChild(card);
        }
    }
}

function openModal(item) {
    const modalBody = document.getElementById("modalBody");
    const modalLabel = document.getElementById("accountModalLabel");

    if (!modalBody || !modalLabel) return;

    modalLabel.textContent = item.name || "Unnamed";

    const fields = [
        ["dp_id", "DP ID"],
        ["login_id", "Login ID"],
        ["key", "Key"],
        ["account_number", "Account Number"],
        ["crn", "CRN"],
        ["boid", "BOID"]
    ];

    let html = '<div class="rows">';

    for (const [key, label] of fields) {
        const valObj = safeValue(item[key]);
        html += `
            <div class="row">
                <div class="label">${label}</div>
                <div class="value${valObj.empty ? ' empty' : ''}">${valObj.text}</div>
                <button class="btn" onclick="window.copyText('${valObj.empty ? '' : String(item[key]).replace(/'/g, "\\'")}')">Copy</button>
            </div>
        `;
    }

    html += '</div>';
    modalBody.innerHTML = html;

    const modal = new bootstrap.Modal(document.getElementById('accountModal'));
    modal.show();
}

async function loadData() {
    if (!gridEl) return;
    gridEl.innerHTML = "";

    try {
        const res = await fetch(API_URL, { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);

        const json = await res.json();

        if (!Array.isArray(json)) {
            throw new Error("API did not return an array");
        }

        // Normalize keys
        allData = json.map(x => ({
            name: x.name ?? "",
            dp_id: x.dp_id ?? "",
            login_id: x.login_id ?? "",
            key: x.key ?? "",
            account_number: x.account_number ?? "",
            crn: x.crn ?? "",
            boid: x.boid ?? ""
        }));

        render(allData);
    } catch (err) {
        console.error("Load Data Error:", err);
    }
}

// Re-render on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (allData.length > 0) {
            render(allData);
        }
    }, 250);
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const savedTheme = localStorage.getItem('theme') || 'light';

if (themeToggle && themeIcon) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// Initialize
loadData();
