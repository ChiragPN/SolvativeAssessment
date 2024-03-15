const searchBox = document.getElementById('searchBox');
const resultsTable = document.getElementById('resultsTable');
const loadingRow = document.getElementById('loadingRow');
const pagination = document.getElementById('pagination');
const pageNumbers = document.getElementById('pageNumbers');
const limitInput = document.getElementById('limitInput');

let currentPage = 1;
let totalResults = 0;
let limit = 5;

searchBox.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    performSearch();
  }
});

document.addEventListener('keydown', function(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === '/') {
    searchBox.focus();
    event.preventDefault();
  }
});

limitInput.addEventListener('change', function() {
  limit = parseInt(limitInput.value);
  if (limit > 10) {
    limit = 10;
    limitInput.value = 10;
    alert('Maximum limit is 10.');
  }
  fetchData();
});

document.getElementById('prevPage').addEventListener('click', function() {
  if (currentPage > 1) {
    currentPage--;
    fetchData();
  }
});

document.getElementById('nextPage').addEventListener('click', function() {
  if (currentPage < Math.ceil(totalResults / limit)) {
    currentPage++;
    fetchData();
  }
});

function performSearch() {
  const query = searchBox.value.trim();
  if (!query) {
    displayNoResultsMessage("Start searching");
    return;
  }
  currentPage = 1;
  fetchData();
}

function fetchData() {
    const query = searchBox.value.trim();
    loadingRow.classList.remove('hidden');
//   const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?q=${query}&limit=${limit}&start=${startIndex}`
//   fetch(url, {
//     method: 'GET',
//     params: { countryIds: 'IN', namePrefix: 'del', limit: '5' },
//     headers: {
//         'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
//         'x-rapidapi-key': '4ac5e3352fmshe6ac515ca3b8ccap1f0045jsnf0a504a87bbe'
//     }
//   })
//     .then(response => response.json())
//     .then(data => {
//       renderResults(data);
//       updatePagination();
//       loadingRow.classList.add('hidden');
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//       loadingRow.classList.add('hidden');
//     });
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=IN&namePrefix=${query}&limit=${limit}&offset=${(currentPage - 1) * limit}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4ac5e3352fmshe6ac515ca3b8ccap1f0045jsnf0a504a87bbe',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    fetch(url, options).then(response => response.json())
    .then(data => {
        console.log(data);
        renderResults(data);
        updatePagination();
        loadingRow.classList.add('hidden');
    }).catch (error => {
        console.error('Error fetching data:', error);
        loadingRow.classList.add('hidden');
    })
}

function renderResults(data) {
  totalResults = data.totalResults || 0;
  console.log(totalResults);
  if (totalResults === 0) {
    displayNoResultsMessage("No result found");
    return;
  }
  resultsTable.querySelector('tbody').innerHTML = '';
  data.results.forEach((result, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${result.placeName}</td>
      <td><img src="https://www.countryflagsapi.com/${result.countryCode}/flat/64.png" alt="${result.countryName} flag">${result.countryName}</td>
    `;
    resultsTable.querySelector('tbody').appendChild(row);
  });
}

function displayNoResultsMessage(message) {
  resultsTable.querySelector('tbody').innerHTML = `<tr><td colspan="3">${message}</td></tr>`;
  pagination.classList.add('hidden');
}

function updatePagination() {
  const totalPages = Math.ceil(totalResults / limit);
  if (totalPages > 1) {
    pagination.classList.remove('hidden');
    let pageHtml = '';
    for (let i = 1; i <= totalPages; i++) {
      pageHtml += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    pageNumbers.innerHTML = pageHtml;
  } else {
    pagination.classList.add('hidden');
  }
}

function goToPage(page) {
  currentPage = page;
  fetchData();
}