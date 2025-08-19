import { geminiAi, supabase } from "./config.js";
import podcasts from "./data.js";

async function main() {
  const response = await geminiAi.models.embedContent({
    model: "gemini-embedding-001",
    contents: podcasts,
  });

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

main();
