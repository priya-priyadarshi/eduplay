const express = require("express");
const router = express.Router();

router.post("/generate-questions", async (req, res) => {

    try {

        const {
            degree,
            branch,
            semester,
            subject,
            topic,
            level
        } = req.body;

        // ================= QUESTIONS =================

        let questions = [];

        for (let i = 1; i <= 5; i++) {

            questions.push({

                question:
                    `${level} Question ${i} from ${topic} (${subject})`,

                options: [
                    "Option A",
                    "Option B",
                    "Option C",
                    "Option D"
                ],

                answer: "Option A"
            });
        }

        res.json({
            success: true,
            degree,
            branch,
            semester,
            subject,
            topic,
            level,
            questions
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Question generation failed"
        });
    }
});

module.exports = router;