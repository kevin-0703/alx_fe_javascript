document.addEventListener("DOMContentLoaded", function () {
    let quotes = [
        { text: "The journey of a thousand miles begins with one step.", category: "Inspiration" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Do or do not. There is no try.", category: "Motivation" }
    ];
    const qoutedisplay = document.getElementById("qouteDisplay");
    const newqoutebtn = document.getElementById("newQoute");
    newqoutebtn.addEventListener("click", showRandomQuote);
    function showRandomQuote() {
        if (quotes.length === 0) {
            qouteDisplay.textContent = "No quotes available.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const qoute = quotes[randomIndex];
        qouteDisplay.textContent = `"${qoute.text}" - ${qoute.category}`;
    };
    function addQuote() {
        const textInput = document.getElementById("qouteInput");
        const categoryInput = document.getElementById("categoryInput");
        const newQuoteText = textInput.value.trim();
        const newQuoteCategory = categoryInput.value.trim();
        if (!newQuoteText || !newQuoteCategory) {
            alert("Please enter both quote and category.");
            return;
        }
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        textInput.value = "";
        categoryInput.value = "";
        qouteDisplay.textContent = `added new qoute:"${newQuote.text}" - ${newQuote.category}`;
    };
});