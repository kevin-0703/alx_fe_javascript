document.addEventListener("DOMContentLoaded", () => {
    let quotes = loadQuotes();

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");
    const syncStatus = document.getElementById("syncStatus");
    const syncBtn = document.getElementById("syncBtn");

    // Load last selected category filter
    const lastCategory = localStorage.getItem("selectedCategory");
    if (lastCategory) {
        categoryFilter.value = lastCategory;
    }

    // Show last viewed quote from sessionStorage
    const lastViewed = sessionStorage.getItem("lastQuote");
    if (lastViewed) {
        quoteDisplay.innerHTML = lastViewed;
    }

    // Show a random quote in the selected category
    function showRandomQuote() {
        const selected = categoryFilter.value;
        const filtered = selected === "all"
            ? quotes
            : quotes.filter(q => q.category.toLowerCase() === selected.toLowerCase());

        if (filtered.length === 0) {
            quoteDisplay.innerHTML = "<em>No quotes in this category.</em>";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filtered.length);
        const quote = filtered[randomIndex];
        const html = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
        quoteDisplay.innerHTML = html;

        sessionStorage.setItem("lastQuote", html);
    }

    // Add a new quote and update storage and dropdown
    function addQuote() {
        const textInput = document.getElementById("newQuoteText");
        const categoryInput = document.getElementById("newQuoteCategory");

        const newText = textInput.value.trim();
        const newCategory = categoryInput.value.trim();

        if (!newText || !newCategory) {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = { text: newText, category: newCategory };
        quotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // ✅ Post to server
        postQuoteToServer(newQuote);

        textInput.value = "";
        categoryInput.value = "";

        quoteDisplay.innerHTML = `<p><strong>Added:</strong> "${newQuote.text}"</p><small>— ${newQuote.category}</small>`;

        populateCategories();
    }

    // Post new quote to server
    async function postQuoteToServer(quote) {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: quote.text,
                    body: quote.category
                })
            });

            if (!response.ok) {
                throw new Error("Failed to post quote to server");
            }

            const result = await response.json();
            console.log("Posted to server:", result);
        } catch (err) {
            console.error("Error posting quote:", err);
        }
    }

    // Dynamically populate categories in the dropdown
    function populateCategories() {
        const uniqueCategories = [...new Set(quotes.map(q => q.category))];
        const current = categoryFilter.value;

        categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
        uniqueCategories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });

        // Restore selection
        if (uniqueCategories.includes(current)) {
            categoryFilter.value = current;
        }
    }

    // Save selected category and display a notice
    window.filterQuotes = function filterQuotes() {
        const selected = categoryFilter.value;
        localStorage.setItem("selectedCategory", selected);
        quoteDisplay.innerHTML = `<em>Filtered by "${selected}" — click 'Show New Quote'</em>`;
    };

    // Create the add-quote form
    function createAddQuoteForm() {
        const formContainer = document.getElementById("formContainer");
        formContainer.innerHTML = `
        <div class="form-group">
          <label for="newQuoteText">Quote Text</label>
          <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        </div>
        <div class="form-group">
          <label for="newQuoteCategory">Quote Category</label>
          <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        </div>
        <button id="addQuoteBtn">Add Quote</button>
      `;
        document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
    }

    // Fetch quotes from the server (server wins on conflict)
    async function fetchQuotesFromServer() {
        try {
            syncStatus.textContent = "Fetching quotes from server...";
            const response = await fetch("https://jsonplaceholder.typicode.com/posts");
            const serverData = await response.json();

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
            syncStatus.textContent = "Quotes synced with server!";
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

    // Export quotes to JSON
    function exportToJsonFile() {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "quotes.json";
        link.click();
        URL.revokeObjectURL(url);
    }

    // Import quotes from JSON file
    function importFromJsonFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");

                quotes.push(...importedQuotes);
                localStorage.setItem("quotes", JSON.stringify(quotes));
                alert("Quotes imported successfully!");

                populateCategories();
            } catch (err) {
                alert("Failed to import quotes: " + err.message);
            }
        };
        reader.readAsText(file);
    }

    // Load saved quotes
    function loadQuotes() {
        const stored = localStorage.getItem("quotes");
        try {
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    // Initialize
    createAddQuoteForm();
    populateCategories();
    newQuoteBtn.addEventListener("click", showRandomQuote);
    document.getElementById("exportJson").addEventListener("click", exportToJsonFile);
    document.getElementById("importFile").addEventListener("change", importFromJsonFile);
});
