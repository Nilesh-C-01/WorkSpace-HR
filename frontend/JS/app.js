// ==========================================
// CONFIGURATION & STATE
// ==========================================
const API_URL = "https://workspace-hr.onrender.com/api/employees/";
let allEmployees = []; 
let employeeIdToDelete = null;

// ==========================================
// AUTHENTICATION GUARD
// ==========================================
const token = localStorage.getItem("workspaceToken");
const userDataStr = localStorage.getItem("workspaceUser");

// Redirect to login if token is missing
if (!token || !userDataStr) {
    window.location.href = "login.html";
}

const userData = JSON.parse(userDataStr);

// Initialize UI
document.addEventListener("DOMContentLoaded", () => {
    // Populate user profile in the header
    document.getElementById("displayUserName").innerText = userData.name;
    document.getElementById("userAvatar").innerText = userData.initials;

    // Fetch initial data
    fetchEmployees();
});

// Logout User
function handleLogout() {
    localStorage.removeItem("workspaceToken");
    localStorage.removeItem("workspaceUser");
    window.location.href = "login.html";
}

// ==========================================
// CREATE: REGISTER NEW EMPLOYEE
// ==========================================
document.getElementById("onboardingForm").addEventListener("submit", async function(e) {
    e.preventDefault(); 
    
    const empData = {
        name: document.getElementById("empName").value,
        email: document.getElementById("empEmail").value,
        role: document.getElementById("empRole").value,
        joining_date: document.getElementById("empDate").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(empData)
        });

        if (response.ok) {
            document.getElementById("onboardingForm").reset();
            fetchEmployees(); 
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.detail || "Registration failed."}`);
        }
    } catch (error) {
        console.error("Form submission error:", error);
    }
});

// ==========================================
// READ: FETCH ALL EMPLOYEES
// ==========================================
async function fetchEmployees() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        // Handle expired or invalid token
        if (response.status === 401) {
            handleLogout();
            return;
        }

        if (response.ok) {
            allEmployees = await response.json(); 
            renderTable(allEmployees); 
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// ==========================================
// UI RENDER: DYNAMIC TABLE HTML
// ==========================================
function renderTable(data) {
    const tableBody = document.getElementById("employeeTableBody");
    tableBody.innerHTML = ""; 

    // Handle Empty State gracefully
    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-12 text-center text-[#444746] dark:text-[#c4c7c5]">
                    <span class="material-symbols-outlined text-4xl mb-2 opacity-50">badge</span>
                    <p class="font-medium">No employees found.</p>
                    <p class="text-sm opacity-70">Add a new employee using the form above.</p>
                </td>
            </tr>
        `;
        return;
    }

    // Render Rows
    data.forEach(emp => {
        const initials = emp.name.substring(0, 2).toUpperCase();
        
        const row = `
            <tr class="border-b border-[#e1e3e1] dark:border-[#444746] hover:bg-[#f3f6fc] dark:hover:bg-[#282a2d] transition-colors">
                <td class="px-6 py-4 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-[#1e8e3e] text-white flex items-center justify-center font-medium">${initials}</div>
                    <div>
                        <div class="text-sm font-medium">${emp.name}</div>
                        <div class="text-xs text-[#444746] dark:text-[#c4c7c5]">${emp.email}</div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-[#444746] dark:text-[#c4c7c5]">${emp.role}</td>
                <td class="px-6 py-4 text-sm text-[#444746] dark:text-[#c4c7c5]">${emp.joining_date}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#e6f4ea] dark:bg-[#0f5223] text-[#137333] dark:text-[#6dd58c]">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#137333] dark:bg-[#6dd58c]"></span> Active
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="openDeleteModal(${emp.id}, '${emp.name}')" class="p-2 text-[#444746] dark:text-[#c4c7c5] hover:bg-[#fce8e6] dark:hover:bg-[#5c1e19] hover:text-[#c5221f] dark:hover:text-[#f28b82] rounded-full transition-colors">
                        <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// ==========================================
// DELETE: CUSTOM MODAL LOGIC
// ==========================================
function openDeleteModal(id, name) {
    employeeIdToDelete = id; 
    document.getElementById('deleteModalTitle').innerText = `Remove ${name}?`;
    
    const modal = document.getElementById('deleteModal');
    const modalBox = modal.querySelector('div.relative');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalBox.classList.remove('scale-95');
        modalBox.classList.add('scale-100');
    }, 10);
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    const modalBox = modal.querySelector('div.relative');
    
    modal.classList.add('opacity-0');
    modalBox.classList.remove('scale-100');
    modalBox.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        employeeIdToDelete = null; 
    }, 300);
}

document.getElementById('confirmDeleteBtn').addEventListener('click', async function() {
    if (employeeIdToDelete) {
        const btn = this;
        const originalText = btn.innerText;
        btn.innerText = "Removing...";
        btn.disabled = true;

        try {
            const response = await fetch(`${API_URL}${employeeIdToDelete}`, { 
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                closeDeleteModal();
                fetchEmployees(); 
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
});

// ==========================================
// SEARCH: CLIENT-SIDE FILTERING
// ==========================================
document.getElementById("searchInput").addEventListener("input", function(e) {
    const searchTerm = e.target.value.toLowerCase(); 
    const filteredData = allEmployees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm) || 
        emp.role.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredData);
});

// ==========================================
// AI AGENT WORKFLOW (RESUME PARSING)
// ==========================================

// Toggle the AI Textbox visibility
function toggleAIBox() {
    const box = document.getElementById("aiBox");
    box.classList.toggle("hidden");
}

// Call the AI Backend to parse the text
async function parseResume() {
    const resumeText = document.getElementById("resumeText").value;
    const parseBtn = document.getElementById("parseBtn");
    
    if (!resumeText.trim()) {
        alert("Please paste some text first!");
        return;
    }

    // UI Loading State
    const originalText = parseBtn.innerText;
    parseBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> AI is thinking...`;
    parseBtn.disabled = true;

    try {
       const response = await fetch("https://workspace-hr.onrender.com/api/parse-resume/", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ resume_text: resumeText })
        });

        if (response.ok) {
            const result = await response.json();
            const aiData = result.data;
            
            // Autonomously fill the form inputs
            if (aiData.name) document.getElementById("empName").value = aiData.name;
            if (aiData.email) document.getElementById("empEmail").value = aiData.email;
            
            // Map the role if it matches the dropdown options
            const roleSelect = document.getElementById("empRole");
            for (let i = 0; i < roleSelect.options.length; i++) {
                if (roleSelect.options[i].text.includes(aiData.role)) {
                    roleSelect.selectedIndex = i;
                    break;
                }
            }
            
            // Auto-set today's date for joining
            document.getElementById("empDate").valueAsDate = new Date();
            
            // Hide the box and clear text
            toggleAIBox();
            document.getElementById("resumeText").value = "";
            
        } else {
            alert("Failed to parse the resume. Please check if your API key is correct in main.py.");
        }
    } catch (error) {
        console.error("AI Agent Error:", error);
    } finally {
        // Reset button
        parseBtn.innerText = originalText;
        parseBtn.disabled = false;
    }
}