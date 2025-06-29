document.addEventListener("DOMContentLoaded", () => {
    let quotes = loadQuotes();

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");

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

        textInput.value = "";
        categoryInput.value = "";

        quoteDisplay.innerHTML = `<p><strong>Added:</strong> "${newQuote.text}"</p><small>— ${newQuote.category}</small>`;

        populateCategories();
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
