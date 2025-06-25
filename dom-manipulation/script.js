document.addEventListener("DOMContentLoaded", () => {
    // List of quotes
    let quotes = [
        { text: "The journey of a thousand miles begins with one step.", category: "Inspiration" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Do or do not. There is no try.", category: "Motivation" }
    ];

    // DOM elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");

    // ✅ Show a random quote using innerHTML
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "<em>No quotes available. Please add one!</em>";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
    }

    // ✅ Add a new quote dynamically
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

        // Clear form fields
        textInput.value = "";
        categoryInput.value = "";

        // Display confirmation with innerHTML
        quoteDisplay.innerHTML = `<p><strong>Added new quote:</strong> "${newQuote.text}"</p><small>— ${newQuote.category}</small>`;
    }

    // Event listener for quote button
    newQuoteBtn.addEventListener("click", showRandomQuote);

    // Make addQuote globally accessible
    window.addQuote = addQuote;
});
