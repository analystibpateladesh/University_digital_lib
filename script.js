const API_URL = "https://script.google.com/macros/s/AKfycbz7yIDKGDjHPQYWUJ4c3hVfI5WOG7z2ZerOH6orZ_19JVwNgnzXkLHxIVy9i1BYWX9j/exec";

let books = [];

const searchInput = document.getElementById("searchInput");
const authorFilter = document.getElementById("authorFilter");
const yearFilter = document.getElementById("yearFilter");
const sortFilter = document.getElementById("sortFilter");
const resultsList = document.getElementById("resultsList");
const resultsCount = document.getElementById("resultsCount");

// FETCH DATA FROM YOUR WEBAPP
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    books = data;
    populateFilters();
    renderBooks();
  })
  .catch(err => {
    console.error("Error loading data:", err);
    resultsList.innerHTML = "<p>Failed to load data.</p>";
  });

function populateFilters() {
  // unique authors
  [...new Set(books.map(b => b.author))]
    .forEach(author => authorFilter.innerHTML += `<option value="${author}">${author}</option>`);

  // unique years
  [...new Set(books.map(b => b.year))]
    .forEach(year => yearFilter.innerHTML += `<option value="${year}">${year}</option>`);
}

function renderBooks() {
  const searchValue = searchInput.value.toLowerCase();

  let filtered = books.filter(book => {
    return (
      book.title.toLowerCase().includes(searchValue) &&
      (authorFilter.value === "" || book.author === authorFilter.value) &&
      (yearFilter.value === "" || book.year == yearFilter.value)
    );
  });

  // SORT
  filtered.sort((a, b) => {
    return sortFilter.value === "year"
      ? b.year - a.year
      : a.title.localeCompare(b.title);
  });

  resultsCount.textContent = `${filtered.length} results found`;

  resultsList.innerHTML = filtered.map(book => `
    <div class="item">
      <h4>${book.title}</h4>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Year:</strong> ${book.year}</p>
      <p><strong>Type:</strong> ${book.resource_type}</p>
      <p><strong>Desc:</strong> ${book.description}</p>
      <a href="${book.drive_link}" target="_blank">Open Resource</a>
    </div>
  `).join("");
}

searchInput.addEventListener("input", renderBooks);
authorFilter.addEventListener("change", renderBooks);
yearFilter.addEventListener("change", renderBooks);
sortFilter.addEventListener("change", renderBooks);
