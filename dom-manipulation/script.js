document.addEventListener("DOMContentLoaded", () => {
    // Initial array of quotes
    let quotes = [
        { text: "The journey of a thousand miles begins with one step.", category: "Inspiration" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Do or do not. There is no try.", category: "Motivation" }
    ];

    // DOM references
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");

    // Display a random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available. Please add one!";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    }

    // Add a new quote from form inputs
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

        // Clear form
        textInput.value = "";
        categoryInput.value = "";

        // Show confirmation
        quoteDisplay.textContent = `Added new quote: "${newQuote.text}" — ${newQuote.category}`;
    }

    // Attach event listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    window.addQuote = addQuote; // Make it globally accessible for the onclick in HTML
});
