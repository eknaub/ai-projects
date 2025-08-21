import { geminiAi, supabase } from "../conf/config.js";
import podcasts from "../data/data.js";

const semanticSearchQuery = "I have 30 minutes time, what can I listen to?";

main(semanticSearchQuery);

async function main(input) {
  //await uploadPodcastEmbeddingsToSupabase();

  const data = await retrieveMatchingPodcasts(input);

  const response = await geminiAi.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Question: ${input} - Context: ${data.data[0].content}`,
          },
        ],
      },
    ],
    config: {
      systemInstruction:
        'You are an enthusiastic podcast expert who loves recommending podcasts to people. You will be given two pieces of information - some context about podcasts episodes and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don\'t know the answer." Please do not make up the answer.',
    },
  });

  console.log(response.candidates[0].content);
}

async function retrieveMatchingPodcasts(input) {
  const response = await createEmbedding(input);

  const embedding = response.embeddings[0].values;

  try {
    const data = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 1,
    });

    if (data.error) {
      throw data.error;
    } else {
      console.log("Matched Documents:", data);
      return data;
    }
  } catch (error) {
    console.error("Error matching documents:", error);
  }
}

async function createEmbedding(query) {
  const response = await geminiAi.models.embedContent({
    model: "gemini-embedding-001",
    contents: query,
  });
  return response;
}

async function uploadPodcastEmbeddingsToSupabase() {
  const response = await createEmbedding(podcasts);

  const podcastEmbeddings = response.embeddings.map((e, index) => ({
    content: podcasts[index],
    embedding: e.values,
  }));

  try {
    const data = await supabase.from("documents").insert(podcastEmbeddings);
    if (data.error) {
      throw data.error;
    } else {
      console.log("Inserted Podcast Embeddings:", data);
      return data;
    }
  } catch (error) {
    console.error("Error inserting podcast embeddings:", error);
  }
}
