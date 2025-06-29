const syncStatus = document.getElementById("syncStatus");
const syncBtn = document.getElementById("syncBtn");

async function fetchQuotesFromServer() {
    try {
        syncStatus.textContent = "Fetching quotes from server...";
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const serverData = await response.json();

        // Convert server data to our format:
        const serverQuotes = serverData.slice(0, 5).map(item => ({
            text: item.title,
            category: item.body
        }));

        return serverQuotes;
    } catch (err) {
        console.error("Error fetching server quotes:", err);
        syncStatus.textContent = "Error fetching server data.";
        return [];
    }
}

function areQuotesDifferent(localQuotes, serverQuotes) {
    return JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes);
}

async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();

    if (serverQuotes.length === 0) {
        return;
    }

    if (areQuotesDifferent(quotes, serverQuotes)) {
        // Conflict detected - server wins
        quotes = serverQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        syncStatus.textContent = "Quotes synced. Server data has overwritten local quotes.";
    } else {
        syncStatus.textContent = "Quotes are up to date.";
    }
}

// Manual sync button
syncBtn.addEventListener("click", () => {
    syncQuotes();
});

// Automatic periodic sync every 30 seconds
setInterval(() => {
    syncQuotes();
}, 30000);
