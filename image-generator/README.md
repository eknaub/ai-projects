# Image Generator

Image Generator is a web application that creates AI-generated images based on your text descriptions. Enter a prompt, and the app uses Google's Gemini AI to generate a unique image for you.

## Features

- Enter a text description to generate an image
- Uses Gemini AI's Imagen model for high-quality image generation
- Displays the generated image directly in the app

## How It Works

1. Type a description of the image you want to generate.
2. Click **Generate Image**.
3. The app sends your prompt to Gemini AI.
4. The generated image is displayed in the app.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Angular CLI](https://angular.dev/tools/cli)
- Gemini API key (for AI image generation)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/image-generator.git
   cd image-generator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your API key in `src/environments/environment.ts`:
   ```ts
   export const environment = {
     geminiApiKey: "YOUR_GEMINI_API_KEY",
   };
   ```

### Development Server

Start the local development server:

```bash
ng serve
```

Open your browser at [http://localhost:4200/](http://localhost:4200/).

### Building

To build the project for production:

```bash
ng build
```

## Disclaimer

This application is for educational and entertainment purposes only. Generated images may not always be accurate or appropriate for all use cases.

## License

MIT

---

For more information on using the Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
