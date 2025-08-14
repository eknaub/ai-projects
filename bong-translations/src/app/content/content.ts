import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../environments/environment';
import { MatSelectModule } from '@angular/material/select';
import { Languages } from '../../utils/languages';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-content',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './content.html',
  styleUrl: './content.less',
})
export class Content {
  private ai = new GoogleGenAI({
    apiKey: environment.geminiApiKey,
  });

  protected languages = Object.entries(Languages).map(([key, value]) => ({
    value,
    viewValue: key,
  }));
  protected readonly translateForm = new FormGroup({
    userInput: new FormControl('', Validators.required),
    fromLanguage: new FormControl(Languages.German, Validators.required),
    toLanguage: new FormControl(Languages.English, Validators.required),
  });
  protected readonly translatedText = signal<string>('');

  protected swapLanguages() {
    const fromLanguage = this.translateForm.get('fromLanguage')?.value;
    const toLanguage = this.translateForm.get('toLanguage')?.value;
    this.translateForm.patchValue({
      fromLanguage: toLanguage,
      toLanguage: fromLanguage,
    });
  }

  protected async translateUserInput() {
    const userInput = this.translateForm.get('userInput')?.value;
    if (!userInput || this.translateForm.invalid) {
      return;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userInput,
        config: {
          systemInstruction: `You are translating text from ${
            this.translateForm.get('fromLanguage')?.value
          } to ${
            this.translateForm.get('toLanguage')?.value
          }. Only respond with the translated text.`,
        },
      });

      if (response && response.text) {
        this.translatedText.set(response.text);
      }
    } catch (error) {
      console.error('Error translating text:', error);
    }
  }
}
