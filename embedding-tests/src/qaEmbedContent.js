import cosineSimilarity from "compute-cosine-similarity";
import { geminiAi } from "../conf/config.js";

async function main() {
  const questions = [
    "What is the meaning of life?",
    "What is the purpose of existence?",
    "How do I bake a cake?",
  ];

  const answers = [
    "The meaning of life is subjective and can vary from person to person.",
    "The purpose of existence is a philosophical question that has been debated for centuries.",
    "To bake a cake, you need to follow a recipe that includes ingredients like flour, sugar, and eggs.",
  ];

  const qaResponse = await geminiAi.models.embedContent({
    model: "gemini-embedding-001",
    contents: questions,
    taskType: "QUESTION_ANSWERING",
  });

  console.log("QA Embeddings:", qaResponse.embeddings[1].values.length);

  const docResponse = await geminiAi.models.embedContent({
    model: "gemini-embedding-001",
    contents: answers,
    taskType: "RETRIEVAL_DOCUMENT",
  });

  const qaEmbeddings = qaResponse.embeddings.map((e, index) => ({
    content: questions[index],
    embeddings: e.values,
  }));

  const docEmbeddings = docResponse.embeddings.map((e, index) => ({
    content: answers[index],
    embeddings: e.values,
  }));

  questions.forEach((question, qIdx) => {
    let bestScore = -Infinity;
    let bestAnswerIdx = -1;
    docEmbeddings.forEach((answerEmbedding, aIdx) => {
      const score = cosineSimilarity(
        qaEmbeddings[qIdx].embeddings,
        answerEmbedding.embeddings
      );
      console.log(
        `Similarity between "${question}" and "${
          answers[aIdx]
        }": ${score.toFixed(4)}`
      );

      if (score > bestScore) {
        bestScore = score;
        bestAnswerIdx = aIdx;
      }
    });
    console.log(`Best answer for "${question}":`);
    console.log(
      `"${answers[bestAnswerIdx]}" (score: ${bestScore.toFixed(4)})\n`
    );
  });
}

main();
