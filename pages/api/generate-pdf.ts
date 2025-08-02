import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(501).json({ 
      error: 'PDF generation not available', 
      message: 'PDF generation requires LaTeX to be installed on the server. Please download the LaTeX file and compile it locally using pdflatex, xelatex, or lualatex.',
      instructions: [
        '1. Download the LaTeX file',
        '2. Install LaTeX on your system (TeX Live, MiKTeX, etc.)',
        '3. Run: pdflatex cover-letter.tex',
        '4. The PDF will be generated in the same directory'
      ]
    });
  } catch (error) {
    console.error('Error in PDF generation endpoint:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 