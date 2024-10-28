import { authenticateUser } from './_apiUtils.js';
import fetch from 'node-fetch';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(400).json({ error: 'Error parsing form data' });
      }

      const imageFile = files.image;
      if (!imageFile) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      // Read the uploaded image file
      const imageData = fs.readFileSync(imageFile.filepath);

      // Call the image recognition API
      const apiKey = process.env.VISION_API_KEY;
      const apiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + apiKey;

      const requestBody = {
        requests: [
          {
            image: {
              content: imageData.toString('base64'),
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 5,
              },
            ],
          },
        ],
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error('Error calling Vision API:', response.statusText);
        return res.status(500).json({ error: 'Error analyzing image' });
      }

      const data = await response.json();
      const labels = data.responses[0].labelAnnotations.map((label) => label.description).join(', ');
      const description = `The image contains: ${labels}.`;

      res.status(200).json({ description });
    });
  } catch (error) {
    console.error('Error:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error analyzing image' });
    }
  }
}