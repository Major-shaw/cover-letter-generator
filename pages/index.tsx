import React, { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [sampleCoverLetter, setSampleCoverLetter] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [pdfData, setPdfData] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');
    setPdfData('');

    const formData = new FormData();
    if (resume) {
      formData.append('resume', resume);
    }
    formData.append('jobDescription', jobDescription);
    if (sampleCoverLetter) {
      formData.append('sampleCoverLetter', sampleCoverLetter);
    }

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }

      const data = await response.json();
      setResult(data.coverLetter);
      setPdfData(data.pdfData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!pdfData) return;

    const byteCharacters = atob(pdfData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'cover-letter.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const downloadLatex = () => {
    if (!result) return;

    const blob = new Blob([result], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'cover-letter.tex';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <>
      <Head>
        <title>AI Cover Letter Generator</title>
        <meta name="description" content="Generate tailored cover letters using AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <div className="header">
          <h1>AI Cover Letter Generator</h1>
          <p>Generate personalized cover letters tailored to your resume and job description</p>
          <p className="note">📝 Note: Resume and cover letter template are optional - we'll use defaults if not provided</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="resume">Resume (PDF/TXT) - Optional:</label>
            <input
              type="file"
              id="resume"
              accept=".pdf,.txt,.docx"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
            <small className="helper-text">Leave empty to use our sample resume</small>
          </div>

          <div className="form-group">
            <label htmlFor="jobDescription">Job Description - Required:</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sampleCoverLetter">Sample Cover Letter (LaTeX file) - Optional:</label>
            <input
              type="file"
              id="sampleCoverLetter"
              accept=".tex,.txt"
              onChange={(e) => setSampleCoverLetter(e.target.files?.[0] || null)}
            />
            <small className="helper-text">Leave empty to use our default template</small>
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Generating Cover Letter...' : 'Generate Cover Letter'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {pdfData && (
          <div className="result">
            <h2>Your Personalized Cover Letter</h2>
            <div className="result-actions">
              <button onClick={downloadPDF} className="download-btn primary">
                📄 Download PDF
              </button>
              <button onClick={downloadLatex} className="download-btn secondary">
                📝 Download LaTeX Source
              </button>
            </div>
            <div className="pdf-container">
              <iframe
                src={`data:application/pdf;base64,${pdfData}`}
                title="Cover Letter PDF"
                className="pdf-viewer"
              />
            </div>
          </div>
        )}

        <style jsx>{`
          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .header {
            text-align: center;
            margin-bottom: 40px;
          }

          .header h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5rem;
          }

          .header p {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 5px;
          }

          .note {
            background: #e3f2fd;
            padding: 10px;
            border-radius: 5px;
            font-size: 0.9rem;
            color: #1976d2;
            margin-top: 10px;
          }

          .form {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
          }

          .helper-text {
            display: block;
            font-size: 0.8rem;
            color: #666;
            margin-top: 4px;
            font-style: italic;
          }

          .form-group input[type="file"] {
            width: 100%;
            padding: 10px;
            border: 2px dashed #ddd;
            border-radius: 5px;
            background: white;
          }

          .form-group textarea {
            width: 100%;
            min-height: 120px;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            resize: vertical;
            font-family: inherit;
          }

          .submit-btn {
            background: #007bff;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s;
            width: 100%;
          }

          .submit-btn:hover:not(:disabled) {
            background: #0056b3;
          }

          .submit-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          .error {
            background: #f8d7da;
            color: #721c24;
            padding: 12px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #f5c6cb;
          }

          .result {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .result h2 {
            color: #333;
            margin-bottom: 20px;
            text-align: center;
          }

          .result-actions {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
          }

          .download-btn {
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
            font-weight: 500;
          }

          .download-btn.primary {
            background: #28a745;
          }

          .download-btn.primary:hover {
            background: #218838;
          }

          .download-btn.secondary {
            background: #6c757d;
          }

          .download-btn.secondary:hover {
            background: #545b62;
          }

          .pdf-container {
            width: 100%;
            height: 600px;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            overflow: hidden;
          }

          .pdf-viewer {
            width: 100%;
            height: 100%;
            border: none;
          }

          @media (max-width: 768px) {
            .container {
              padding: 10px;
            }

            .header h1 {
              font-size: 2rem;
            }

            .form {
              padding: 20px;
            }

            .result-actions {
              flex-direction: column;
            }

            .pdf-container {
              height: 400px;
            }
          }
        `}</style>
      </main>
    </>
  );
} 