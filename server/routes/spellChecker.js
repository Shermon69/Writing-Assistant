const express = require("express");
const spellCheckRoute = express.Router();
const axios = require("axios");

spellCheckRoute.post('/', async (req, res) => {
    const { sentence } = req.body;

    // Validate input
    if (!sentence || typeof sentence !== 'string' || sentence.trim() === '') {
        return res.status(400).json({ error: "Please provide a valid non-empty sentence" });
    }

    try {
        const cohereRes = await axios.post(
            "https://api.cohere.ai/v1/generate",
            {
                model: "command",
                prompt: `Correct only the spelling errors in the following sentence. Do not change the sentence structure, meaning, or add any extra text, explanations, or punctuation beyond what is necessary. Return ONLY the corrected sentence with no additional words, phrases, or characters:\n${sentence.trim()}`,
                max_tokens: 100,
                temperature: 0,
                stop_sequences: ["\n", ".", ":", "!", "?"], // Stop at common sentence endings or newlines
                truncate: "END" // Ensure truncation if response exceeds max_tokens
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // Log raw response for debugging
        // console.log("Raw Cohere Response:", cohereRes.data.generations[0].text);

        let checkedText = cohereRes.data.generations[0].text.trim();

        // Remove unwanted prefixes, quotes, or extra text
        checkedText = checkedText
            .replace(/^["']|["']$/g, "") // Remove surrounding quotes
            .replace(/^(Here is|Sure|Corrected sentence|The corrected sentence is)[\s\S]*?:\s*/i, "") // Remove common prefixes
            .replace(/\n[\s\S]*/g, "") // Remove anything after a newline
            .trim();

        // Ensure only the first sentence is returned
        const sentenceEndings = [".", "!", "?"];
        for (const ending of sentenceEndings) {
            if (checkedText.includes(ending)) {
                checkedText = checkedText.split(ending)[0] + ending;
                break;
            }
        }

        // Final validation
        if (!checkedText || checkedText.match(/^(Here is|Sure|Corrected sentence)/i)) {
            return res.status(500).json({ error: "Failed to extract corrected sentence" });
        }

        // res.status(200).json({ checked: checkedText });
        res.status(200).json({checkedText});

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = spellCheckRoute;