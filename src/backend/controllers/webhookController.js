const receiveSms = async (req, res) => {

    try {
        const { senderId, messageBody } = req.body;

        if (!messageBody || typeof messageBody !== 'string' || messageBody.trim === "") {
            console.log(`${messageBody} field cannot be empty`)
            return res.status(400).json(
                {
                    success: false,
                    error: "Invalid payload: 'messageBody' is required and must be a non-empty string."
                }
            );

            const user = req.user;

            // Temporary Ack Response from Gemini
            return res.status(202).json(
                {
                    success: true,
                    message: "SMS payload received and queued for processing.",
                    data: {
                        userId: user ? user._id : null,
                        senderId: senderId || "UNKNOWN",
                        receivedAt: new Date().toISOString(),
                    }
                });
        }

    } catch (error) {
        console.log("ERROR- Internal server error while processing webhook.")
        return res.status(500).json(
            {
                success: false,
                error: "Internal server error while processing webhook.",
            }
        )
    }
}

module.exports = {
    receiveSms,
}