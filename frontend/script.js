
const analyzeForm = document.getElementById("analyzeForm");
const analyzeButton = document.getElementById("analyzeButton");
const statusMessage = document.getElementById("statusMessage");
const resultSection = document.getElementById("resultSection");
const reanalyzeButton = document.getElementById("reanalyzeButton");

analyzeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const resumeText = document.getElementById("resumeText").value.trim();
    const jobDescription = document.getElementById("jobDescription").value.trim();

    if (!resumeText || !jobDescription) {
        statusMessage.textContent =
            "Please enter both your resume and job description.";
        return;
    }

    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";
    statusMessage.textContent = "Analyzing your resume...";
    resultSection.hidden = true;

    try {
        const response = await fetch("http://localhost:8080/api/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                resumeText: resumeText,
                jobDescription: jobDescription
            })
        });

        if (!response.ok) {
            throw new Error("Server returned status " + response.status);
        }

        const result = await response.json();
        const score = Math.max(0, Math.min(100, Number(result.matchScore) || 0));

        document.getElementById("matchScore").textContent = score + "%";

        const scoreProgress = document.getElementById("scoreProgress");
        scoreProgress.style.width = score + "%";

        const scoreTrack = document.getElementById("scoreTrack");
        scoreTrack.setAttribute("aria-valuenow", score);

        let headline;
        let description;

        if (score >= 80) {
            headline = "Strong keyword alignment";
            description = "Your resume contains many of the keywords identified in this job description.";
        } else if (score >= 50) {
            headline = "Room to strengthen your match";
            description = "Review the missing keywords and improve your resume where relevant.";
        } else {
            headline = "An opportunity to improve";
            description = "Compare the job requirements with your real skills and relevant projects.";
        }

        document.getElementById("scoreHeadline").textContent = headline;
        document.getElementById("scoreDescription").textContent = description;

        document.getElementById("matchedSkills").textContent =
            result.matchedSkills || "No matching skills found";

        document.getElementById("missingSkills").textContent =
            result.missingSkills || "No missing skills found";

        document.getElementById("resultNote").textContent =
            result.note || "This score is a basic keyword-based estimate.";

        const suggestionsList = document.getElementById("suggestionsList");
        suggestionsList.replaceChildren();

        const missingText = (result.missingSkills || "").trim();
        const hasMissingSkills =
            missingText !== "" &&
            missingText.toLowerCase() !== "no missing skills found";

        const suggestions = [];

        if (hasMissingSkills) {
            suggestions.push(
                "Review these job keywords: " + missingText +
                ". Add them only if they accurately describe your skills."
            );
        } else {
            suggestions.push(
                "Keep your resume tailored to the responsibilities in this job description."
            );
        }

        suggestions.push(
            "Add relevant project examples that demonstrate your skills."
        );

        suggestions.push(
            "Use clear bullet points to explain your contributions and results."
        );

        suggestions.forEach(function (suggestion) {
            const item = document.createElement("li");
            item.textContent = suggestion;
            suggestionsList.appendChild(item);
        });

        resultSection.hidden = false;
        statusMessage.textContent = "Analysis completed successfully!";

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {
        console.error("CareerPilot analysis error:", error);

        statusMessage.textContent =
            "Could not connect to the backend. Check that Spring Boot is running on port 8080.";
    } finally {
        analyzeButton.disabled = false;
        analyzeButton.innerHTML =
            'Analyze My Resume <span aria-hidden="true">→</span>';
    }
});

reanalyzeButton.addEventListener("click", function () {
    resultSection.hidden = true;
    statusMessage.textContent = "";

    analyzeForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    document.getElementById("resumeText").focus();
});
