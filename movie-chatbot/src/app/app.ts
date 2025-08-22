import { Component, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private geminiAi = new GoogleGenAI({
    apiKey: environment.GEMINI_API_KEY,
  });
  private supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_API_KEY
  );
  chatHistory: any[] = [];

  protected readonly output = signal<string>('');
  userInput: string = '';

  onInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.userInput = input;
  }

  async executeChatQuery() {
    try {
      this.output.set('Doing the thinking...');
      const input = this.userInput || 'Whats the highest rated movie?';
      const matchingEmbeddings = await this.findNearestMatch(input);

      const response = await this.generateAnswer(input, matchingEmbeddings);

      if (response) {
        this.output.set(response);
      }
      this.userInput = '';
    } catch (error) {
      console.error('Error in main:', error);
      this.output.set("Sorry, I don't know the answer.");
    }
  }

  async generateAnswer(input: string, context: any) {
    try {
      const contents = {
        role: 'user',
        parts: [
          {
            text: `Question: ${input} - Context: ${context}`,
          },
        ],
      };

      const chat = this.geminiAi.chats.create({
        model: 'gemini-2.5-flash',
        history: this.chatHistory,
        config: {
          systemInstruction:
            'You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If the answer is not given in the context, find the answer in the conversation history if possible. If you are unsure and cannot find the answer, say, "Sorry, I don\'t know the answer." Please do not make up the answer. Always speak as if you were chatting to a friend.',
        },
      });

      const response = await chat.sendMessage({
        message: `Question: ${input} - Context: ${context}`,
      });

      this.chatHistory.push(contents);
      this.chatHistory.push(response.candidates?.[0]?.content);

      return response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    } catch (error) {
      console.error('Error generating answer');
      throw error;
    }
  }

  async findNearestMatch(input: string) {
    try {
      const response = await this.createEmbedding(input);
      const embedding = response.embeddings?.[0]?.values;

      const data = await this.supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 3,
      });

      if (data.error) {
        throw data.error;
      }

      return data.data.map((obj: any) => obj.content).join('\n');
    } catch (error) {
      console.error('Error matching documents');
      throw error;
    }
  }

  async createEmbedding(data: any) {
    try {
      const response = await this.geminiAi.models.embedContent({
        model: 'gemini-embedding-001',
        contents: data,
      });

      return response;
    } catch (error) {
      console.error('Error creating embedding');
      throw error;
    }
  }
}
