import { Component, effect, input, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../environments/environment';
import { TicketType } from '../../utils/enums';

@Component({
  selector: 'app-content',
  templateUrl: './content.html',
  styleUrl: './content.css',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
})
export class Content {
  private ai = new GoogleGenAI({
    apiKey: environment.geminiApiKey,
  });

  protected readonly inputForm = new FormGroup({
    input: new FormControl('', Validators.required),
  });
  protected readonly isLoading = signal(false);
  protected readonly dataMap = signal<Map<TicketType, string[]>>(new Map());

  resetForm() {
    this.inputForm.reset();
  }

  constructor() {
    effect(() => {
      console.log(this.dataMap());
    });
  }

  async addTicket() {
    const inputValue = this.inputForm.get('input')?.value;
    if (!inputValue) {
      return;
    }
    this.isLoading.set(true);
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: inputValue,
        config: {
          systemInstruction:
            'You are a system administrator, you will receive a ticket description. Based on the description you will categorize the issue into one of the following categories: "HARDWARE", "SOFTWARE", "OTHER". You only answer with the category name.',
        },
      });

      if (response && response.text && response.text in TicketType) {
        let type = TicketType.OTHER;
        if (response.text in TicketType) {
          type = TicketType[response.text as keyof typeof TicketType];
        }

        this.dataMap.update((map) => {
          const existing = map.get(type) || [];
          existing.push(inputValue);
          return new Map(map).set(type, existing);
        });
      }
    } catch (error) {
      console.error('Error fetching:', error);
      this.isLoading.set(false);
    } finally {
      this.isLoading.set(false);
    }
    this.resetForm();
  }
}
