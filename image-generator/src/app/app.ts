import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../environments/environment';
import { GenerateImagesResponse, GoogleGenAI } from '@google/genai';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatButtonModule,
  ],
})
export class App {
  private ai = new GoogleGenAI({
    apiKey: environment.geminiApiKey,
  });

  protected readonly isGeneratingImage = signal(false);
  protected readonly hasImage = signal(false);
  protected readonly userInputForm = new FormGroup({
    description: new FormControl('', Validators.required),
  });
  protected readonly image = signal<string>('');

  async generateImage() {
    this.isGeneratingImage.set(true);
    try {
      const prompt = this.userInputForm.get('description')?.value;

      if (!prompt) {
        this.isGeneratingImage.set(false);
        return;
      }

      const response: GenerateImagesResponse =
        await this.ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: prompt,
          config: {
            numberOfImages: 1,
          },
        });

      if (response) {
        this.hasImage.set(true);
        this.image.set(response.generatedImages?.at(0)?.image?.gcsUri ?? '');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      this.isGeneratingImage.set(false);
    } finally {
      this.isGeneratingImage.set(false);
    }
  }
}
