import { geminiAi, supabase } from "./config.js";
import podcasts from "./data.js";

main();

async function main() {
  //await uploadPodcastEmbeddingsToSupabase();

  await retrieveMatchingPodcasts();
}

async function getEmbedContent(query) {
  const response = await geminiAi.models.embedContent({
    model: "gemini-embedding-001",
    contents: query,
  });
  return response;
}

async function retrieveMatchingPodcasts() {
  const semanticSearchQuery = "Jamming in the Big Easy";
  //const semanticSearchQuery = "I have 30 minutes time, what can I listen to?";

  const response = await getEmbedContent(semanticSearchQuery);

  const embedding = response.embeddings[0].values;

  try {
    const data = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 3,
    });

    if (data.error) {
      throw data.error;
    } else {
      console.log("Matched Documents:", data);
    }
  } catch (error) {
    console.error("Error matching documents:", error);
  }
}

async function uploadPodcastEmbeddingsToSupabase() {
  const response = await getEmbedContent(podcasts);

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
    }
  } catch (error) {
    console.error("Error inserting podcast embeddings:", error);
  }
}
