
package com.careerpilot.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5501",
        "http://127.0.0.1:5501",
        "https://thecodingmindtm.github.io"
})
public class AnalysisController {

    @PostMapping("/analyze")
    public AnalysisResponse analyze(@Valid @RequestBody AnalysisRequest request) {

        String resume = request.resumeText().toLowerCase();
        String job = request.jobDescription().toLowerCase();

        String[] skills = {
                "java", "spring boot", "sql", "html",
                "css", "javascript", "git", "rest api",
                "react", "python"
        };

        int matched = 0;
        int totalRequired = 0;

        StringBuilder matchedSkills = new StringBuilder();
        StringBuilder missingSkills = new StringBuilder();

        for (String skill : skills) {
            boolean requiredByJob = job.contains(skill);
            boolean presentInResume = resume.contains(skill);

            if (requiredByJob) {
                totalRequired++;

                if (presentInResume) {
                    matched++;
                    matchedSkills.append(skill).append(", ");
                } else {
                    missingSkills.append(skill).append(", ");
                }
            }
        }

        int score = totalRequired == 0
                ? 0
                : (int) Math.round((matched * 100.0) / totalRequired);

        return new AnalysisResponse(
                score,
                matchedSkills.length() == 0
                        ? "No matching skills found"
                        : matchedSkills.substring(0, matchedSkills.length() - 2),
                missingSkills.length() == 0
                        ? "No missing skills found"
                        : missingSkills.substring(0, missingSkills.length() - 2),
                "This is a basic keyword-based estimate, not an employer's actual ATS score."
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationError(
            MethodArgumentNotValidException exception) {

        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Please check your input.");

        return ResponseEntity.badRequest()
                .body(new ErrorResponse(message));
    }

    public record AnalysisRequest(
            @NotBlank(message = "Resume text cannot be empty.")
            @Size(max = 20000, message = "Resume text must be under 20,000 characters.")
            String resumeText,

            @NotBlank(message = "Job description cannot be empty.")
            @Size(max = 20000, message = "Job description must be under 20,000 characters.")
            String jobDescription
    ) {}

    public record AnalysisResponse(
            int matchScore,
            String matchedSkills,
            String missingSkills,
            String note
    ) {}

    public record ErrorResponse(String message) {}
}
