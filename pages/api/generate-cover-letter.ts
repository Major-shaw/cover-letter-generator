import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readFileContent(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function latexToHtml(latexContent: string): string {
  // Basic LaTeX to HTML conversion
  let html = latexContent;
  
  // Remove LaTeX document structure
  html = html.replace(/\\documentclass.*\n/, '');
  html = html.replace(/\\usepackage.*\n/g, '');
  html = html.replace(/\\geometry.*\n/g, '');
  html = html.replace(/\\begin{document}/, '');
  html = html.replace(/\\end{document}/, '');
  
  // Convert letter structure
  html = html.replace(/\\begin{letter}{([^}]+)}/, '<div class="letter-header">$1</div>');
  html = html.replace(/\\end{letter}/, '');
  
  // Convert opening and closing
  html = html.replace(/\\opening{([^}]+)}/, '<div class="opening">$1</div>');
  html = html.replace(/\\closing{([^}]+)}/, '<div class="closing">$1</div>');
  html = html.replace(/\\signature{([^}]+)}/, '<div class="signature">$1</div>');
  
  // Convert itemize
  html = html.replace(/\\begin{itemize}/g, '<ul>');
  html = html.replace(/\\end{itemize}/g, '</ul>');
  html = html.replace(/\\item\s+/g, '<li>');
  
  // Convert line breaks
  html = html.replace(/\\\\/g, '<br>');
  
  // Clean up extra whitespace
  html = html.replace(/\n\s*\n/g, '</p><p>');
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cover Letter</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
            color: #333;
        }
        .letter-header {
            margin-bottom: 2em;
            white-space: pre-line;
        }
        .opening {
            margin-bottom: 1em;
        }
        .closing {
            margin-top: 2em;
            margin-bottom: 1em;
        }
        .signature {
            margin-top: 3em;
        }
        p {
            margin-bottom: 1em;
        }
        ul {
            margin: 1em 0;
            padding-left: 2em;
        }
        li {
            margin-bottom: 0.5em;
        }
    </style>
</head>
<body>
    <p>${html}</p>
</body>
</html>`;
}

async function generatePDF(htmlContent: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in'
      }
    });
    
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }

  return data.candidates[0].content.parts[0].text;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  try {
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to parse form data' });
      }

      const jobDescription = Array.isArray(fields.jobDescription) 
        ? fields.jobDescription[0] 
        : fields.jobDescription;

      if (!jobDescription) {
        return res.status(400).json({ error: 'Job description is required' });
      }

      try {
        // Handle resume file - use default if not provided
        const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume;
        let resumeContent: string;
        
        if (resumeFile && resumeFile.filepath) {
          resumeContent = await readFileContent(resumeFile.filepath);
          fs.unlinkSync(resumeFile.filepath); // Clean up uploaded file
        } else {
          // Use default resume
          const defaultResumePath = path.join(process.cwd(), 'public', 'defaults', 'default-resume.txt');
          resumeContent = await readFileContent(defaultResumePath);
        }

        // Handle sample cover letter file - use default if not provided
        const sampleCoverLetterFile = Array.isArray(files.sampleCoverLetter) 
          ? files.sampleCoverLetter[0] 
          : files.sampleCoverLetter;
        let sampleCoverLetterContent: string;
        
        if (sampleCoverLetterFile && sampleCoverLetterFile.filepath) {
          sampleCoverLetterContent = await readFileContent(sampleCoverLetterFile.filepath);
          fs.unlinkSync(sampleCoverLetterFile.filepath); // Clean up uploaded file
        } else {
          // Use default cover letter template
          const defaultCoverLetterPath = path.join(process.cwd(), 'public', 'defaults', 'default-cover-letter.html');
          sampleCoverLetterContent = await readFileContent(defaultCoverLetterPath);
        }

        const prompt = `
You are an expert in creating professional cover letters. Your task is to generate a new cover letter based on the following inputs:

RESUME CONTENT:
${resumeContent}

JOB DESCRIPTION:
${jobDescription}

SAMPLE COVER LETTER (LaTeX Template):
${sampleCoverLetterContent}

Instructions:
1. Create a new cover letter that follows the EXACT structure and formatting of the sample LaTeX template
2. Maintain all LaTeX commands, document structure, and formatting from the sample
3. Replace the content with personalized information based on the resume and job description
4. Highlight relevant skills, experiences, and achievements from the resume that match the job requirements
5. Ensure the tone and style are professional and compelling
6. Keep the same LaTeX document class, packages, and overall structure as the sample
7. Only modify the actual content (text) while preserving all LaTeX formatting commands

Output only the complete LaTeX code for the new cover letter, nothing else.
`;

        const coverLetter = await callGeminiAPI(prompt, process.env.GEMINI_API_KEY!);
        
        // Convert LaTeX to HTML and generate PDF
        const htmlContent = latexToHtml(coverLetter);
        const pdfBuffer = await generatePDF(htmlContent);
        const pdfBase64 = pdfBuffer.toString('base64');

        res.status(200).json({ 
          coverLetter,
          pdfData: pdfBase64
        });

      } catch (error) {
        console.error('Error generating cover letter:', error);
        res.status(500).json({ 
          error: 'Failed to generate cover letter', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 
