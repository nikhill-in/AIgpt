import { chatService } from "../service/chat.service.js";
import { User } from "../model/user.model.js";

export const chat = async (req, res) => {
  try {
    const { message, instructions } = req.body;

    // Validate input before burning an API call on garbage input.
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const reply = await chatService(message, instructions);
    return res.status(200).json({ reply });
  } catch (error) {
    // Never swallow errors silently. Log server-side, return generic
    // message client-side (don't leak stack traces to the client).
    console.error("Chat error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};




const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}


const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}