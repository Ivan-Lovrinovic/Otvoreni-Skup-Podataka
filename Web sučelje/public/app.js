async function load() {
    console.log("app.js loaded");
  const q = document.getElementById("query").value;
  const field = document.getElementById("field").value;

  const res = await fetch(`/api/podaci?q=${q}&field=${field}`);
  const data = await res.json();

  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  data.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.brand}</td>
        <td>${p.category}</td>
        <td>${p.price}</td>
        <td>${p.features}</td>
      </tr>
    `;
  });
}

load();
