import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Parse CV endpoint is working',
    timestamp: new Date().toISOString(),
    openaiConfigured: !!process.env.OPENAI_API_KEY
  });
}

function extractPositions(text: string): any[] {
  const positions: any[] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let inExperienceSection = false;
  let currentPosition: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Detect experience section
    if (lowerLine.includes('experiencia') || lowerLine.includes('experience')) {
      inExperienceSection = true;
      continue;
    }
    
    // Stop at other sections
    if (inExperienceSection && (lowerLine.includes('educación') || lowerLine.includes('education') || 
        lowerLine.includes('aptitudes') || lowerLine.includes('skills'))) {
      break;
    }
    
    if (inExperienceSection) {
      // Look for job titles (lines that don't contain dates, bullets, and aren't company names)
      if (!line.includes('-') && !line.includes('•') && line.length > 5 && line.length < 80 &&
          !line.includes('Enero') && !line.includes('Marzo') && !line.includes('Presente') &&
          (line.includes('Developer') || line.includes('Engineer') || line.includes('Designer') || 
           line.includes('Manager') || line.includes('Specialist') || line.includes('Analyst'))) {
        
        // If we have a current position, save it
        if (currentPosition && currentPosition.title) {
          positions.push(currentPosition);
        }
        
        // Start new position
        currentPosition = {
          title: line,
          companyName: '',
          location: '',
          startDate: { month: 1, year: new Date().getFullYear() - 1 },
          endDate: null,
          isCurrent: false,
          description: '',
          summary: ''
        };
        
        // Look ahead for company name (next non-bullet line that doesn't contain job title keywords)
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          if (!nextLine.includes('•') && !nextLine.includes('-') && nextLine.length < 50 &&
              !nextLine.includes('Developer') && !nextLine.includes('Engineer') && 
              !nextLine.includes('Designer') && !nextLine.includes('Manager')) {
            currentPosition.companyName = nextLine;
          }
        }
        
        // Look for date range and current status
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const dateLine = lines[j];
          if (dateLine.includes('-') && (dateLine.includes('Presente') || dateLine.includes('Present'))) {
            currentPosition.isCurrent = true;
            break;
          }
        }
        
        // Collect description from bullet points
        const descriptions: string[] = [];
        for (let j = i + 1; j < lines.length && j < i + 10; j++) {
          if (lines[j].startsWith('•')) {
            descriptions.push(lines[j].substring(1).trim());
          } else if (descriptions.length > 0) {
            break;
          }
        }
        currentPosition.description = descriptions.join('\n');
        currentPosition.summary = descriptions.length > 0 ? descriptions[0] : '';
      }
    }
  }
  
  // Add the last position
  if (currentPosition && currentPosition.title) {
    positions.push(currentPosition);
  }
  
  return positions;
}

function extractSkills(text: string): any[] {
  const skills: any[] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let inSkillsSection = false;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Detect skills section
    if (lowerLine.includes('aptitudes') || lowerLine.includes('skills') || 
        lowerLine.includes('habilidades') || lowerLine.includes('principales')) {
      inSkillsSection = true;
      continue;
    }
    
    // Stop at other sections
    if (inSkillsSection && (lowerLine.includes('experiencia') || lowerLine.includes('experience') ||
        lowerLine.includes('educación') || lowerLine.includes('education'))) {
      break;
    }
    
    if (inSkillsSection && line.length > 0 && line.length < 30) {
      // Add individual skills
      skills.push({ name: line, endorsementCount: null });
    }
  }
  
  return skills;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let extractedText = '';
    
    // Extract text from file
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        // Use dynamic import to avoid compilation issues
        const pdfParse = require('pdf-parse');
        const buffer = Buffer.from(await file.arrayBuffer());
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
        
        if (!extractedText || extractedText.trim().length < 10) {
          throw new Error('PDF appears to be empty or contains no readable text');
        }
        
        console.log(`Extracted ${extractedText.length} characters from PDF`);
      } catch (pdfError) {
        console.error('PDF extraction error:', pdfError);
        return NextResponse.json({ 
          error: 'Failed to extract text from PDF. Please ensure the PDF contains readable text.',
          details: pdfError instanceof Error ? pdfError.message : 'PDF parsing failed'
        }, { status: 400 });
      }
    } else {
      // Handle other file types
      extractedText = await file.text();
    }

    // Basic parsing - extract email, phone, etc.
    const emailMatch = extractedText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
    const phoneMatch = extractedText.match(/\+\d{10,15}/g);
    const linkedinMatch = extractedText.match(/(linkedin\.com\/in\/[^\s\)]+)/gi);
    
    // Extract name from lines that look like names
    const lines = extractedText.split('\n').filter(line => line.trim().length > 0);
    let firstName = '', lastName = '';
    
    for (const line of lines.slice(0, 10)) {
      const trimmed = line.trim();
      // Skip common CV headers, contact info, and job titles
      if (trimmed.includes('@') || trimmed.includes('www.') || trimmed.includes('+') || 
          trimmed.includes('DEVELOPER') || trimmed.includes('ENGINEER') || 
          trimmed.includes('DESIGNER') || trimmed.includes('SPECIALIST') ||
          trimmed.includes('MANAGER') || trimmed.includes('DIRECTOR') ||
          trimmed.length > 50 || trimmed.length < 5) {
        continue;
      }
      
      const words = trimmed.split(' ').filter(w => w.length > 1);
      // Look for 2-4 words that could be a name (first, middle, last names)
      if (words.length >= 2 && words.length <= 4 && 
          words.every(w => /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(w))) {
        firstName = words[0];
        lastName = words.slice(1).join(' ');
        break;
      }
    }

    // Extract location
    const locationMatch = extractedText.match(/([A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Za-z\s]+)/g);
    
    // Extract headline
    let headline = '';
    for (const line of lines) {
      if (line.includes('DEVELOPER') || line.includes('ENGINEER') || 
          line.includes('DESIGNER') || line.includes('SPECIALIST')) {
        headline = line.trim();
        break;
      }
    }

    const parsedData = {
      data: {
        profile: {
          firstName: firstName || 'N/A',
          lastName: lastName || 'N/A',
          headline: headline || 'Professional',
          summary: 'Extracted from PDF content',
          location: locationMatch ? locationMatch[0] : '',
          emailAddress: emailMatch ? emailMatch[0] : '',
          phoneNumbers: phoneMatch || [],
          publicProfileUrl: linkedinMatch ? `https://${linkedinMatch[0]}` : ''
        },
        positions: extractPositions(extractedText),
        educations: [],
        skills: extractSkills(extractedText)
      },
      extractedText: extractedText.substring(0, 1000) + (extractedText.length > 1000 ? '...' : ''),
      message: 'PDF processed successfully with real text extraction'
    };

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Error processing CV:', error);
    return NextResponse.json({ 
      error: 'Failed to process CV. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}