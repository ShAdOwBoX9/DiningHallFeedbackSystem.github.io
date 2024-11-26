document.addEventListener("DOMContentLoaded", () => {
    const feedbackForm = document.getElementById("feedbackForm");
    const commentsSection = document.querySelector(".comments-section");
    const adminButton = document.getElementById("exportFeedback");
    const adminIdInput = document.getElementById("adminId");

    // Store all feedback data
    const feedbackData = [];

    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get input values
        const studentId = document.getElementById("studentId").value.trim();
        const diningService = document.getElementById("diningService").value;
        const mealName = document.getElementById("mealName").value.trim();
        const rating = document.querySelector("input[name='star']:checked")?.value || "0";
        const comment = document.getElementById("comment").value.trim();
        const isAnonymous = document.getElementById("anonymous").checked;

        // Validate inputs
        if (!mealName || !diningService || (!isAnonymous && !studentId)) {
            alert("Please fill out all required fields.");
            return;
        }

        // Save feedback data
        const feedbackEntry = {
            studentId: isAnonymous ? "Anonymous" : studentId,
            diningService,
            mealName,
            rating,
            comment: comment || "No comment provided",
        };
        feedbackData.push(feedbackEntry);

        // Create a feedback card
        const feedbackCard = document.createElement("div");
        feedbackCard.classList.add("feedback-card");

        feedbackCard.innerHTML = `
            <h3>${mealName} (${diningService})</h3>
            <p><strong>Rating:</strong> ${rating} Stars</p>
            <p><strong>Comment:</strong> ${feedbackEntry.comment}</p>
            <p><strong>Submitted by:</strong> ${feedbackEntry.studentId}</p>
        `;

        // Add the card to the comments section
        commentsSection.appendChild(feedbackCard);

        // Reset the form
        feedbackForm.reset();
        alert("Thank you for your feedback!");
    });

    // Export feedback data as Excel file
    adminButton.addEventListener("click", () => {
        const adminId = adminIdInput.value.trim();

        // Simple admin authentication
        if (adminId !== "ADMIN123") {
            alert("Invalid Admin ID!");
            return;
        }

        if (feedbackData.length === 0) {
            alert("No feedback available to export!");
            return;
        }

        // Convert feedback data to CSV format
        const rows = [
            ["Student ID", "Dining Service", "Meal Name", "Rating", "Comment"],
            ...feedbackData.map(entry => [
                entry.studentId,
                entry.diningService,
                entry.mealName,
                entry.rating,
                entry.comment,
            ]),
        ];

        const csvContent = rows.map(row => row.join(",")).join("\n");

        // Create and download the file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "feedback_data.csv";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
