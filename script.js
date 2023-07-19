let emojisData = []; // Store the fetched emoji data
let currentPage = 1; // Track the current page

fetch('https://emojihub.yurace.pro/api/all')
  .then(response => response.json())
  .then(data => {
    emojisData = data; // Update the emoji data
    displayEmojis(emojisData);
  })
  .catch(error => {
    console.log('Error:', error);
  });

const container = document.querySelector('.container');
const categoryFilter = document.getElementById('categoryFilter');
const pagination = document.getElementById('pagination');
categoryFilter.addEventListener('change', handleCategoryFilter);
pagination.addEventListener('click', handlePagination);

function displayEmojis(emojis) {
  const start = (currentPage - 1) * 10;
  const end = start + 10;
  const slicedEmojis = emojis.slice(start, end);

  container.innerHTML = '';

  slicedEmojis.forEach(emoji => {
    const card = createEmojiCard(emoji);
    container.appendChild(card);
  });

  // Calculate the number of pages
  const pageCount = Math.ceil(emojis.length / 10);

  // Update the pagination buttons
  pagination.innerHTML = '';
  if (pageCount > 1) {
    const previousButton = createPaginationButton('Previous', currentPage - 1);
    pagination.appendChild(previousButton);

    for (let i = 1; i <= pageCount; i++) {
      const pageButton = createPaginationButton(i, i);
      if (i === currentPage) {
        pageButton.classList.add('active');
      }
      pagination.appendChild(pageButton);
    }

    const nextButton = createPaginationButton('Next', currentPage + 1);
    pagination.appendChild(nextButton);
  }
}

function handleCategoryFilter() {
  const selectedCategory = categoryFilter.value;

  let filteredEmojis = emojisData;

  if (selectedCategory !== 'all') {
    filteredEmojis = emojisData.filter(emoji => emoji.category === selectedCategory);
  }

  currentPage = 1; // Reset to the first page
  displayEmojis(filteredEmojis);
}

function handlePagination(event) {
  const page = event.target.dataset.page;

  if (page === 'previous') {
    if (currentPage > 1) {
      currentPage--;
    }
  } else if (page === 'next') {
    const pageCount = Math.ceil(emojisData.length / 10);
    if (currentPage < pageCount) {
      currentPage++;
    }
  } else {
    currentPage = parseInt(page);
  }

  const selectedCategory = categoryFilter.value;
  let filteredEmojis = emojisData;

  if (selectedCategory !== 'all') {
    filteredEmojis = emojisData.filter(emoji => emoji.category === selectedCategory);
  }

  displayEmojis(filteredEmojis);
}

function createEmojiCard(emoji) {
  const card = document.createElement('div');
  card.classList.add('emoji-card');

  const name = document.createElement('h2');
  name.textContent = emoji.name;
  card.appendChild(name);

  const category = document.createElement('p');
  category.textContent = `Category: ${emoji.category}`;
  card.appendChild(category);

  const group = document.createElement('p');
  group.textContent = `Group: ${emoji.group}`;
  card.appendChild(group);

  const htmlCode = document.createElement('p');
  htmlCode.innerHTML = `${emoji.htmlCode[0]}`;
  card.appendChild(htmlCode);

  return card;
}

function createPaginationButton(label, page) {
  const button = document.createElement('button');
  button.textContent = label;
  button.dataset.page = page;
  return button;
}
