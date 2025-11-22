import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId is required' },
        { status: 400 }
      );
    }

    // Get document data from request body
    const body = await request.json();
    const { fileData, extractedText, fileName, generateSummary } = body;

    console.log('[v0] Generating flowchart for document:', documentId);
    console.log('[v0] File name:', fileName || 'Unknown');
    console.log('[v0] Has file data:', !!fileData);
    console.log('[v0] Extracted text length:', extractedText?.length || 0);

    // Generate AI summary if requested
    let aiSummary = null;
    if (generateSummary) {
      console.log('[v0] Generating AI summary...');
      if (extractedText) {
        // Use extracted text with OpenAI
        aiSummary = await generateSummaryWithOpenAI(extractedText, fileName || 'Unknown Document');
      } else {
        aiSummary = 'No text could be extracted from the document. Please try uploading a different file.';
      }
    }

    // Extract visualization metadata from the AI summary
    let vizData = null;
    let cleanSummary = aiSummary || '';

    if (aiSummary) {
      const vizDataMatch = aiSummary.match(/<VIZDATA>([\s\S]*?)<\/VIZDATA>/);
      if (vizDataMatch) {
        try {
          vizData = JSON.parse(vizDataMatch[1].trim());
          // Remove the VIZDATA section from the summary shown to user
          cleanSummary = aiSummary.replace(/<VIZDATA>[\s\S]*?<\/VIZDATA>/, '').trim();
          console.log('[v0] Extracted visualization metadata:', JSON.stringify(vizData, null, 2));
        } catch (parseError) {
          console.error('[v0] Failed to parse VIZDATA:', parseError);
        }
      }
    }

    // Return the summary with visualization metadata
    return NextResponse.json({
      aiSummary: cleanSummary,
      vizData,
      nodes: [],
      edges: [],
      description: 'Medical report analysis complete'
    });
  } catch (error) {
    console.error('[v0] Flowchart generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate flowchart' },
      { status: 500 }
    );
  }
}

// Keep GET for backwards compatibility
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId is required' },
        { status: 400 }
      );
    }

    console.warn('[v0] Using fallback - GET method deprecated, use POST with document data');

    // Generate fallback flowchart
    const flowchartData = await generateFlowchartWithOpenAI(
      'No text available'
    );

    return NextResponse.json(flowchartData);
  } catch (error) {
    console.error('[v0] Flowchart generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate flowchart' },
      { status: 500 }
    );
  }
}

// Helper function to generate document summary with OpenAI
async function generateSummaryWithOpenAI(extractedText: string, fileName: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return 'AI summary not available - OpenAI API key not configured.';
  }

  try {
    console.log('[v0] Calling OpenAI for summary generation...');

    // Truncate text if too long
    const maxLength = 30000;
    const textToAnalyze = extractedText.length > maxLength
      ? extractedText.substring(0, maxLength) + '...[truncated]'
      : extractedText;

    const prompt = `You are a Medical Document Analyzer. Output TWO parts:

PART 1: JSON METADATA (between <VIZDATA> tags) - THIS WILL NOT BE SHOWN TO USER:
<VIZDATA>
{
  "reportType": "blood_test" | "prescription" | "imaging" | "general",
  "affectedOrgans": ["heart", "liver", "kidney", "pancreas", "thyroid", "lungs", etc.],
  "tests": [
    {
      "testName": "Glucose",
      "category": "metabolic" | "blood_count" | "liver" | "kidney" | "thyroid" | "lipid" | "cardiac",
      "visualizationType": "test_tube" | "gauge" | "line_graph" | "organ_diagram" | "progress_bar" | "comparison_bar",
      "patientValue": 145,
      "normalMin": 70,
      "normalMax": 100,
      "unit": "mg/dL",
      "trend": "increasing" | "decreasing" | "stable",
      "historicalValues": [120, 135, 145],
      "organAffected": "pancreas",
      "severity": "normal" | "borderline" | "concerning" | "critical",
      "icon": "🩸" | "💊" | "🫀" | "🧠" | "🫁" | "🩺"
    }
  ]
}
</VIZDATA>

PART 2: PATIENT-FRIENDLY SUMMARY:

# 🩺 Medical Report Summary

## 1. Quick TL;DR
- Bullet points of the top 3–5 findings
- One sentence reassurance

## 2. What This Report Is
(short 2–3 line explanation)

## 3. Key Abnormal Findings Explained Simply

For each abnormal value:
### 🔹 [Test Name]: [Value with unit]
**What this means:**
(1–2 lines explaining simply)

**Possible symptoms:**
• List specific symptoms patients might experience

**Why it matters:**
(short explanation of health impact)

**Normal range:**
X – Y (with units)

### 📊 Visual Aid Instruction
- **Type:** [e.g., "test_tube", "gauge", "line_graph"]
- **What to show:** [Patient's value vs normal range]
- **Thresholds:** [e.g., "Normal: 70-100 | Prediabetic: 100-125 | Diabetic: 126+"]
- **Colors:** [Green for normal zone, Yellow for borderline, Red for high risk]
- **Highlight:** [Mark patient's value clearly]
- **Caption:** [Simple one-line explanation for patient]

## 4. Normal Values (Reassurance Section)
List everything that is within normal ranges with brief reassurance.

## 5. Overall Health Picture
1–2 short paragraphs summarizing what all findings together suggest about the patient's health.

## 6. Suggested Next Steps
• Lifestyle changes to consider
• Follow-up tests or appointments
• Questions to discuss with doctor

IMPORTANT: Output VIZDATA first, then the summary. Be detailed in the JSON metadata.

Document Text:
${textToAnalyze}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a medical document analysis expert. Provide detailed, accurate analysis of medical reports in a patient-friendly format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const summary = completion.choices[0]?.message?.content?.trim() || '';

    console.log('[v0] AI summary generated successfully');
    return summary;
  } catch (error) {
    console.error('[v0] Summary generation failed:', error);
    return `Document: ${fileName}\n\nUnable to generate AI summary at this time.`;
  }
}

// Helper function to call OpenAI and generate flowchart structure
async function generateFlowchartWithOpenAI(
  extractedText: string
): Promise<any> {
  // If no OpenAI API key, fallback to static flowchart
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    console.warn('[v0] NEXT_PUBLIC_OPENAI_API_KEY not set, using fallback flowchart');
    return generateFallbackFlowchart();
  }

  try {
    console.log('[v0] Calling OpenAI for flowchart generation...');

    // Truncate text if too long
    const maxLength = 30000;
    const textToAnalyze = extractedText.length > maxLength
      ? extractedText.substring(0, maxLength) + '...[truncated]'
      : extractedText;

    const prompt = `Analyze this document and generate a flowchart in JSON format with this structure:
{
  "nodes": [
    { "id": "node-0", "label": "string", "type": "start|process|decision|end", "description": "string" }
  ],
  "edges": [
    { "source": "node-0", "target": "node-1", "label": "condition or action" }
  ],
  "riskAssessment": "high|medium|low"
}

Document Text:
${textToAnalyze}

Generate a flowchart showing the key process flow in this document. Return ONLY valid JSON, no markdown formatting or extra text.`;

    // Call OpenAI to analyze document and generate flowchart structure
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a flowchart generation expert. Generate structured JSON flowcharts from document text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('[v0] OpenAI response received:', content.substring(0, 200) + '...');

    const flowchartData = JSON.parse(content);
    console.log('[v0] Successfully parsed flowchart with', flowchartData.nodes?.length || 0, 'nodes');

    // Add positions to nodes for rendering
    const nodesWithPositions = flowchartData.nodes.map(
      (node: any, idx: number) => ({
        ...node,
        position: { x: 0, y: idx * 120 },
      })
    );

    return {
      ...flowchartData,
      nodes: nodesWithPositions,
      description: `AI-generated flowchart analysis using OpenAI GPT-4o. Risk Level: ${flowchartData.riskAssessment || 'Unknown'}`,
    };
  } catch (error) {
    console.error('[v0] OpenAI flowchart generation failed:', error);
    // Fallback if OpenAI call fails
    return generateFallbackFlowchart();
  }
}

function generateFallbackFlowchart() {
  const nodeSequence = [
    { label: 'Upload Document', type: 'start' },
    { label: 'Extract Text', type: 'process' },
    { label: 'Analyze with AI', type: 'process' },
    { label: 'Generate Summary', type: 'process' },
    { label: 'Create Flowchart', type: 'process' },
    { label: 'Review Complete', type: 'end' },
  ];

  const nodes = nodeSequence.map((node, idx) => ({
    id: `node-${idx}`,
    label: node.label,
    type: node.type,
    position: { x: 0, y: idx * 120 },
  }));

  return {
    nodes,
    edges: nodes.slice(0, -1).map((node, idx) => ({
      source: node.id,
      target: nodes[idx + 1].id,
      label: 'Next',
    })),
    description: 'Fallback flowchart showing document analysis pipeline.',
  };
}
