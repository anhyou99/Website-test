const API = "http://localhost:3000/api";

async function register() {
    const regEmail = document.getElementById("regEmail");
    const regPass = document.getElementById("regPass");

    await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: regEmail.value,
            password: regPass.value
        })
    });

    alert("Registered!");
}

async function login() {
    const loginEmail = document.getElementById("loginEmail");
    const loginPass = document.getElementById("loginPass");

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPass.value
        })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    window.location = "dashboard.html";
}

// Chỉ chạy khi ở dashboard
if (window.location.pathname.includes("dashboard")) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location = "index.html";
    } else {
        loadNotes();
    }
}

async function addNote() {
    const token = localStorage.getItem("token");
    const title = document.getElementById("title");
    const content = document.getElementById("content");

    await fetch(`${API}/notes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
        body: JSON.stringify({
            title: title.value,
            content: content.value
        })
    });

    title.value = "";
    content.value = "";
    loadNotes();
}

async function loadNotes() {
    const token = localStorage.getItem("token");
    const noteList = document.getElementById("noteList");

    const res = await fetch(`${API}/notes`, {
        headers: { "authorization": token }
    });

    const notes = await res.json();

    noteList.innerHTML = "";
    notes.forEach(n => {
        noteList.innerHTML += `
            <li>
                <strong>${n.title}</strong><br>
                ${n.content}
                <button onclick="deleteNote('${n._id}')">X</button>
            </li>
        `;
    });
}

async function deleteNote(id) {
    const token = localStorage.getItem("token");

    await fetch(`${API}/notes/${id}`, {
        method: "DELETE",
        headers: { "authorization": token }
    });

    loadNotes();
}

function logout() {
    localStorage.removeItem("token");
    window.location = "index.html";
}