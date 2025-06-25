document.addEventListener("DOMContentLoaded", () => {
    // Initial quote list
    let quotes = [
        { text: "The journey of a thousand miles begins with one step.", category: "Inspiration" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Do or do not. There is no try.", category: "Motivation" }
    ];

    // DOM references
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

    // ✅ Add a new quote from input values
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

        // Clear inputs
        textInput.value = "";
        categoryInput.value = "";

        quoteDisplay.innerHTML = `<p><strong>Added new quote:</strong> "${newQuote.text}"</p><small>— ${newQuote.category}</small>`;
    }

    // ✅ Dynamically create the form using innerHTML
    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        formContainer.id = "quoteForm";

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

        document.body.appendChild(formContainer);

        // Attach event to the new button
        const addBtn = document.getElementById("addQuoteBtn");
        addBtn.addEventListener("click", addQuote);
    }

    // ✅ Initial setup
    newQuoteBtn.addEventListener("click", showRandomQuote);
    createAddQuoteForm(); // 🔁 now called to build the form

    // Optionally expose for debugging
    window.addQuote = addQuote;
    window.showRandomQuote = showRandomQuote;
    window.createAddQuoteForm = createAddQuoteForm;
});
