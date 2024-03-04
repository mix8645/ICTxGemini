const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const textOnly = async (prompt) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({model: "gemini-pro"});
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const multimodal = async (imageBinary) => {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({model: "gemini-pro-vision"});
  const prompt = "ช่วยบรรยายภาพนี้ให้หน่อย";
  const mimeType = "image/png";

  // Convert image binary to a GoogleGenerativeAI.Part object.
  const imageParts = [
    {
      inlineData: {
        data: Buffer.from(imageBinary, "binary").toString("base64"),
        mimeType,
      },
    },
  ];

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const result = await model.generateContent(
      [prompt, ...imageParts], safetySettings);
  const text = result.response.text();
  return text;
};

const chat = async (prompt) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({model: "gemini-pro"});
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: "สวัสดีจ้า",
      },
      {
        role: "model",
        parts: "สวัสดีค่ะ ฉันชื่อมะลิ เป็นผู้ช่วยตอบคำถามค่ะ",
      },
      {
        role: "user",
        parts: "ปัจจุบันมี LINE API อะไรบ้างที่ใช้งานได้ในประเทศไทย",
      },
      {
        role: "model",
        parts: "ปัจจุบันมีทั้ง Messaging API",
      },
    ],
  });

  const result = await chat.sendMessage(prompt);
  return result.response.text();
};

module.exports = {textOnly, multimodal, chat};
