import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { readFile } from "fs/promises";
import { geminiAi, supabase } from "../conf/config.js";

main();

async function main() {
  //await createAndUploadEmbeddingsToSupabase();

  try {
    const input = "Whats the highest rated movie?";
    const matchingEmbeddings = await findNearestMatch(input);

    const response = await generateAnswer(input, matchingEmbeddings);

    console.log(response);
    // Output: "Oh, that's an easy one! Based on the ratings you've provided, the highest-rated movie is **Oppenheimer** with an 8.6 rating! It's a fantastic film!"
  } catch (error) {
    console.error("Error in main:", error);
  }
}

async function generateAnswer(input, context) {
  try {
    const response = await geminiAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Question: ${input} - Context: ${context}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction:
          'You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don\'t know the answer." Please do not make up the answer.',
      },
    });

    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating answer");
    throw error;
  }
}

async function findNearestMatch(input) {
  try {
    const response = await createEmbedding(input);
    const embedding = response.embeddings[0].values;

    const data = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 3,
    });

    if (data.error) {
      throw data.error;
    }

    return data.data.map((obj) => obj.content).join("\n");
  } catch (error) {
    console.error("Error matching documents");
    throw error;
  }
}

async function createAndUploadEmbeddingsToSupabase() {
  try {
    const filePath = "../data/movies.txt";

    const textChunks = await splitDocument(filePath);
    const embeddings = await createEmbedding(textChunks);
    await uploadEmbeddingsToSupabase(textChunks, embeddings.embeddings);
  } catch (error) {
    console.error("Error creating and uploading embeddings:", error);
  }
}

async function splitDocument(filePath) {
  try {
    const text = await readFile(filePath, "utf-8");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 250,
      chunkOverlap: 35,
    });
    const chunks = await splitter.splitText(text);

    return chunks;
  } catch (error) {
    console.error("Error splitting document");
    throw error;
  }
}

async function createEmbedding(data) {
  try {
    const response = await geminiAi.models.embedContent({
      model: "gemini-embedding-001",
      contents: data,
    });

    return response;
  } catch (error) {
    console.error("Error creating embedding");
    throw error;
  }
}

async function uploadEmbeddingsToSupabase(textChunks, embeddings) {
  const supabaseData = embeddings.map((e, index) => ({
    content: textChunks[index],
    embedding: e.values,
  }));

  try {
    const insertedDocuments = await supabase
      .from("documents")
      .insert(supabaseData);

    if (insertedDocuments.error) {
      throw insertedDocuments.error;
    }

    return insertedDocuments;
  } catch (error) {
    console.error("Error inserting embeddings");
    throw error;
  }
}
