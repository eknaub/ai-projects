import { geminiAi, systemPrompt } from "../conf/config.js";
import { getCurrentWeather, getLocation } from "./tools.js";

const MAX_ITERATIONS = 5;

const availableFunctions = {
  getCurrentWeather,
  getLocation,
};

function isFinalAnswer(text) {
  return /Answer:/i.test(text);
}

function getNeededAction(text) {
  const actionMatch = text.match(/Action:\s*(\w+):\s*(.*)/);
  if (!actionMatch) {
    throw new Error("No valid action found in response.");
  }
  const funcName = actionMatch[1];
  const param = actionMatch[2].split("\n")[0].trim();
  return { funcName, param };
}

async function main() {
  let currentIteration = 0;
  const chatHistory = [];

  const agent = geminiAi.chats.create({
    model: "gemini-2.5-flash",
    contents: chatHistory,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  let message = "Question: What is the current weather in my location?";
  let finalAnswer = false;

  while (!finalAnswer && currentIteration < MAX_ITERATIONS) {
    chatHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await agent.sendMessage({ message });
    const text = response.candidates[0].content.parts[0].text;

    chatHistory.push({
      role: "assistant",
      parts: response.candidates[0].content.parts,
    });

    console.log(text);

    if (isFinalAnswer(text)) {
      finalAnswer = true;
      break;
    }

    const { funcName, param } = getNeededAction(text);
    const observation = await availableFunctions[funcName](param);

    message = `Observation: ${observation}`;
    currentIteration++;
  }
}

main();
