document.addEventListener("DOMContentLoaded", () => {
    // Load quotes from local storage
    let quotes = (() => {
        const stored = localStorage.getItem("quotes");
        try {
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    })();

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");

    // Show last viewed quote from sessionStorage
    const lastViewed = sessionStorage.getItem("lastQuote");
    if (lastViewed) {
        quoteDisplay.innerHTML = lastViewed;
    }

    // ✅ Show random quote and save to sessionStorage
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "<em>No quotes available. Please add one!</em>";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        const html = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
        quoteDisplay.innerHTML = html;

        // Save to session storage
        sessionStorage.setItem("lastQuote", html);
    }

    // ✅ Add quote and save to localStorage inline
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

        // ✅ Save directly to localStorage
        localStorage.setItem("quotes", JSON.stringify(quotes));

        textInput.value = "";
        categoryInput.value = "";

        quoteDisplay.innerHTML = `<p><strong>Added:</strong> "${newQuote.text}"</p><small>— ${newQuote.category}</small>`;
    }

    // ✅ Create form dynamically
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

    // ✅ Export to JSON file
    function exportToJsonFile() {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "quotes.json";
        link.click();
        URL.revokeObjectURL(url);
    }

    // ✅ Import from JSON file and update localStorage
    function importFromJsonFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");

                quotes.push(...importedQuotes);

                // ✅ Save directly to localStorage
                localStorage.setItem("quotes", JSON.stringify(quotes));

                alert("Quotes imported successfully!");
            } catch (err) {
                alert("Failed to import quotes: " + err.message);
            }
        };
        reader.readAsText(file);
    }

    // Initialize
    newQuoteBtn.addEventListener("click", showRandomQuote);
    createAddQuoteForm();
    document.getElementById("exportJson").addEventListener("click", exportToJsonFile);
    document.getElementById("importFile").addEventListener("change", importFromJsonFile);
});
