# Blind Assistant App

The Blind Assistant App helps visually impaired users understand the content of images using artificial intelligence and provides a voice response.

## User Journey

1. **Sign In with ZAPT**
   - The user opens the app and is prompted to sign in using the "Sign in with ZAPT" option.
   - The user clicks on the sign-in link, which uses Supabase Auth UI for authentication.

2. **Upload an Image**
   - Once signed in, the user is presented with an option to upload an image.
   - The user clicks the "Upload Image" button and selects an image from their device.

3. **Image Analysis**
   - After uploading, the app sends the image to the backend for analysis using an AI image recognition service.
   - The app displays a loading indicator while processing.

4. **Voice Response**
   - The app receives a textual description of the image content from the AI service.
   - The description is sent to a text-to-speech service to generate an audio response.
   - The app plays the audio response to the user, describing the content of the image.

5. **View Image Description (Optional)**
   - The user can optionally view the textual description of the image on the screen.

## External Services Used

- **Supabase Auth**: Used for user authentication.
- **AI Image Recognition API**: Used to analyze the uploaded images and generate descriptions.
- **Text-to-Speech API**: Used to convert the image descriptions into audio playback.

## Environment Variables

- `VISION_API_KEY`: API key for the AI Image Recognition service.
