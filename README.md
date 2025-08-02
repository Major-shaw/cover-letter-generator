# AI Cover Letter Generator

A sophisticated web application that generates personalized cover letters using Google's Gemini-1.5-pro API. The system automatically extracts personal details from resumes and creates tailored cover letters with proper contact information included.

## 📁 Project Location
This project is located at: `/home/atulya/Desktop/ai-cover-letter-generator/`

All project files have been organized in a dedicated directory for better project management.

## ✨ Key Features

- 📄 **Smart Resume Processing**: Automatically extracts personal details (name, email, phone, address, LinkedIn, portfolio)
- 📝 **Optional File Uploads**: Resume and cover letter template are optional - uses professional defaults if not provided
- 🌐 **HTML-Based Generation**: Creates clean, professional HTML cover letters (no LaTeX complexity)
- 📦 **Direct PDF Download**: Instant PDF generation and download using Puppeteer
- 🤖 **AI-Powered Content**: Uses Gemini-1.5-pro for intelligent, job-specific content generation
- 🎨 **Professional Templates**: Beautiful, responsive HTML templates with proper styling
- ⚡ **Fast Processing**: Optimized workflow from upload to PDF generation

## 🆕 Latest Updates

### Personal Details Integration
- **Automatic Extraction**: The system now automatically extracts personal information from uploaded resumes
- **Contact Information**: All cover letters include complete contact details prominently displayed
- **Smart Defaults**: Uses a comprehensive sample resume with realistic professional details when no resume is uploaded

### HTML-First Approach
- **Modern Templates**: Switched from LaTeX to HTML for better compatibility and styling
- **Professional Styling**: Clean, print-ready designs that look great in PDF format
- **Easy Customization**: HTML templates are easier to modify and extend

### Enhanced User Experience
- **Simplified Workflow**: Only job description is required - everything else is optional
- **Clear Indicators**: Shows when personal details have been successfully extracted
- **Dual Download Options**: Both PDF and HTML source downloads available

## Prerequisites

- Node.js 14+ 
- Google Gemini API key
- Chrome/Chromium (automatically handled by Puppeteer)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ai-cover-letter-generator
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Get your API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Basic Usage (Recommended)
1. **Enter Job Description**: Paste the job posting you're applying for
2. **Generate**: Click "Generate Cover Letter" 
3. **Download**: Get your personalized PDF cover letter instantly

The system will use professional defaults and create a complete cover letter with sample contact information.

### Advanced Usage
1. **Upload Your Resume**: Add your own resume to use your actual contact details and experience
2. **Custom Template**: Upload your own HTML template for personalized formatting
3. **Generate**: Create a fully customized cover letter
4. **Download**: Get both PDF and HTML versions

## File Formats Supported

- **Resume**: PDF, TXT, DOCX
- **Custom Templates**: HTML, HTM, TXT
- **Output**: PDF (primary), HTML source (optional)

## Default Files

The system includes professional defaults:

### Default Resume (`public/defaults/default-resume.txt`)
- Complete software engineer profile
- Realistic contact information
- Comprehensive work experience and skills
- Professional formatting

### Default HTML Template (`public/defaults/default-cover-letter.html`)
- Professional business letter format
- Clean, print-ready styling
- Placeholder system for dynamic content
- Mobile-responsive design

## API Endpoints

- `POST /api/generate-cover-letter` - Generates personalized cover letters with contact details
- `POST /api/generate-pdf` - Converts HTML to PDF (handled internally)

## Personal Details Extraction

The system automatically extracts:
- **Full Name**: From resume header or name sections
- **Email Address**: Professional email addresses
- **Phone Number**: Various phone number formats
- **Address**: Physical address information
- **LinkedIn**: Professional LinkedIn profiles
- **Portfolio/Website**: Personal websites and portfolios
- **GitHub**: Development portfolios

## Deployment on Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
./deploy.sh
```

### 3. Configure Environment Variables
In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add `GEMINI_API_KEY` with your API key
3. Redeploy if necessary

**Note**: Puppeteer works seamlessly on Vercel with the current configuration.

## Troubleshooting

### API Key Issues
- Verify your Gemini API key is correct and has proper permissions
- Ensure the environment variable is set in `.env.local`
- Check API key quotas and usage limits

### PDF Generation Issues
- Puppeteer automatically downloads Chromium on first install
- PDF generation works in headless mode for server deployment
- Large HTML content may take longer to process

### File Upload Issues
- Check file size limits (10MB max)
- Ensure supported file formats are being used
- Verify file content is readable and properly formatted

### Personal Details Not Extracted
- Ensure resume follows standard formatting
- Include clear headers like "Email:", "Phone:", etc.
- Check that personal information is in the first few lines

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with different resume formats
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**🎉 Ready to create amazing cover letters with your personal details automatically included!** 