const express = require("express");
const axios = require("axios");
const rephraseRoute = express.Router();

// I filtered the corrected sentence twice, just to ge only the rephrased sentence. COHERE was giving mr the rephrased sentence with extra words and phrases.

rephraseRoute.post("/", async (req, res) => {
    const { sentence } = req.body;

    try {
        const cohereRes = await axios.post(
            "https://api.cohere.ai/v1/generate",
            {
                model: "command",
                prompt: `Rephrase the following sentence while keeping the same meaning.
                        IMPORTANT: Return ONLY the rephrased sentence, no explanations, no extra words, no quotes:\n${sentence}`,
                max_tokens: 60,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let rephrasedSentence = cohereRes.data.generations[0].text.trim();

        // Removing extra quotes
        rephrasedSentence = rephrasedSentence.replace(/^["']|["']$/g, "");

        // Removing  "Sure..." or similar intros
        rephrasedSentence = rephrasedSentence.replace(/^Sure.*?:\s*/i, "");

        // Keep only the first sentence (remove "Let me know..." etc.)
        rephrasedSentence = rephrasedSentence.split(/[\n\r]/)[0].trim();
        if (rephrasedSentence.includes(".")) {
            rephrasedSentence = rephrasedSentence.split(".")[0] + ".";
        }

        res.status(200).json({ rephrasedSentence });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = rephraseRoute;
