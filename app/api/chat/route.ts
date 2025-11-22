import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Define medical assessment tool
const medicalAssessmentTool = tool({
  description: 'Assess medical symptoms and provide preliminary health information',
  parameters: z.object({
    symptoms: z.array(z.string()).describe('List of symptoms reported by the user'),
    severity: z.enum(['mild', 'moderate', 'severe']).describe('Severity level of symptoms'),
    duration: z.string().describe('How long the symptoms have been present'),
  }),
  execute: async ({ symptoms, severity, duration }) => {
    // Simulate medical knowledge base lookup
    const assessment = {
      symptoms,
      severity,
      duration,
      recommendation: severity === 'severe'
        ? 'Seek immediate medical attention at the nearest emergency room or call 911'
        : severity === 'moderate'
        ? 'Schedule an appointment with your healthcare provider within 24-48 hours'
        : 'Monitor symptoms and consider seeing a doctor if they worsen or persist',
      commonCauses: symptoms.length > 0
        ? `Common causes may include viral infections, environmental factors, or stress-related conditions`
        : 'Unable to determine without symptom information',
      selfCare: [
        'Stay hydrated',
        'Get adequate rest',
        'Monitor your temperature',
        'Keep track of symptom changes'
      ]
    };

    return assessment;
  },
});

// Define BMI calculator tool
const bmiCalculatorTool = tool({
  description: 'Calculate Body Mass Index (BMI) and provide health category',
  parameters: z.object({
    weight: z.number().describe('Weight in kilograms'),
    height: z.number().describe('Height in meters'),
  }),
  execute: async ({ weight, height }) => {
    const bmi = weight / (height * height);
    let category = '';
    let recommendation = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      recommendation = 'Consider consulting a nutritionist to develop a healthy weight gain plan';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
      recommendation = 'Maintain your healthy lifestyle with balanced diet and regular exercise';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      recommendation = 'Consider increasing physical activity and making dietary adjustments';
    } else {
      category = 'Obese';
      recommendation = 'Consult with a healthcare provider for a personalized weight management plan';
    }

    return {
      bmi: bmi.toFixed(1),
      category,
      recommendation,
      healthTip: 'Remember, BMI is just one indicator of health. Consult a healthcare professional for comprehensive health assessment.'
    };
  },
});

// Define health tips tool
const healthTipsTool = tool({
  description: 'Provide health and wellness tips for various topics',
  parameters: z.object({
    topic: z.enum(['nutrition', 'exercise', 'sleep', 'stress', 'hydration', 'general']).describe('Health topic to get tips about'),
  }),
  execute: async ({ topic }) => {
    const tips = {
      nutrition: [
        'Eat a variety of colorful fruits and vegetables daily',
        'Choose whole grains over refined grains',
        'Include lean proteins in your meals',
        'Limit processed foods and added sugars',
        'Practice portion control'
      ],
      exercise: [
        'Aim for at least 150 minutes of moderate aerobic activity per week',
        'Include strength training exercises 2-3 times per week',
        'Take breaks from sitting every 30 minutes',
        'Find activities you enjoy to stay motivated',
        'Warm up before and cool down after exercise'
      ],
      sleep: [
        'Maintain a consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Keep your bedroom cool, dark, and quiet',
        'Avoid screens 1 hour before bedtime',
        'Limit caffeine and heavy meals in the evening'
      ],
      stress: [
        'Practice deep breathing exercises',
        'Try meditation or mindfulness',
        'Engage in regular physical activity',
        'Connect with friends and family',
        'Set realistic goals and priorities'
      ],
      hydration: [
        'Drink 8-10 glasses of water daily',
        'Increase water intake during exercise',
        'Eat water-rich foods like fruits and vegetables',
        'Monitor urine color (pale yellow is ideal)',
        'Limit sugary and caffeinated beverages'
      ],
      general: [
        'Schedule regular health check-ups',
        'Practice good hygiene',
        'Protect your skin from sun exposure',
        'Stay up to date with vaccinations',
        'Maintain a balanced lifestyle'
      ]
    };

    return {
      topic,
      tips: tips[topic],
      additionalAdvice: 'These are general wellness tips. Always consult with a healthcare professional for personalized medical advice.'
    };
  },
});

// Define medication reminder tool
const medicationInfoTool = tool({
  description: 'Provide general information about common medications and when to take them',
  parameters: z.object({
    medicationType: z.enum(['pain-relief', 'antibiotic', 'vitamin', 'allergy', 'general']).describe('Type of medication'),
  }),
  execute: async ({ medicationType }) => {
    const info = {
      'pain-relief': {
        generalInfo: 'Pain relievers like acetaminophen or ibuprofen can help with headaches, fever, and minor aches',
        timing: 'Take as directed on the package, typically every 4-6 hours',
        tips: ['Take with food if it upsets your stomach', 'Do not exceed recommended dosage', 'Avoid alcohol when taking pain relievers']
      },
      'antibiotic': {
        generalInfo: 'Antibiotics fight bacterial infections and must be prescribed by a doctor',
        timing: 'Take exactly as prescribed, even if you feel better',
        tips: ['Complete the full course', 'Take at evenly spaced intervals', 'Do not share antibiotics with others']
      },
      'vitamin': {
        generalInfo: 'Vitamins supplement your diet to ensure adequate nutrient intake',
        timing: 'Usually taken once daily, preferably with a meal',
        tips: ['Fat-soluble vitamins (A, D, E, K) are best absorbed with food', 'Take iron supplements with vitamin C for better absorption', 'Consult a doctor before starting supplements']
      },
      'allergy': {
        generalInfo: 'Allergy medications help relieve symptoms like sneezing, itching, and congestion',
        timing: 'Take as directed, often once or twice daily',
        tips: ['Some may cause drowsiness', 'Take before exposure to allergens when possible', 'Consult a doctor if symptoms persist']
      },
      'general': {
        generalInfo: 'Always follow prescription instructions carefully',
        timing: 'Set reminders to take medications at consistent times',
        tips: ['Keep a medication list', 'Store medications properly', 'Check expiration dates regularly', 'Inform your doctor of all medications you take']
      }
    };

    return {
      medicationType,
      ...info[medicationType],
      disclaimer: 'This is general information only. Always follow your healthcare provider\'s specific instructions and prescription labels.'
    };
  },
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are Dr. Chick, a friendly and knowledgeable medical AI assistant for VitalView AI.

PERSONALITY:
- Warm, conversational, and approachable
- Use simple, everyday language
- Be concise but thorough
- Show empathy and understanding

CAPABILITIES:
- You have access to medical assessment tools
- You can calculate BMI and provide health metrics
- You can provide health and wellness tips
- You can give general medication information

STYLE:
- Keep responses SHORT and conversational (2-4 sentences for simple questions)
- Use 1-2 relevant emojis to add warmth
- Break up longer responses for easy reading
- When using tools, explain what you're doing

SAFETY & DISCLAIMERS:
- ALWAYS remind users you provide general information, not medical diagnosis
- For EMERGENCIES (chest pain, difficulty breathing, severe bleeding, signs of stroke):
  Immediately say "🚨 Please call 911 or go to the nearest emergency room immediately"
- For concerning symptoms, recommend seeing a healthcare provider
- When using tools, explain the results in friendly, understandable terms
- Never diagnose conditions or prescribe medications

TOOL USAGE:
- Use medicalAssessment tool when users describe multiple symptoms
- Use bmiCalculator when users ask about BMI or provide height/weight
- Use healthTips when users ask for wellness advice
- Use medicationInfo when users ask about medication timing or general info

Remember: You're here to inform, support, and guide - not to replace professional medical care.`;

    const result = streamText({
      model: openai('gpt-4o'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      tools: {
        medicalAssessment: medicalAssessmentTool,
        bmiCalculator: bmiCalculatorTool,
        healthTips: healthTipsTool,
        medicationInfo: medicationInfoTool,
      },
      maxSteps: 5,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
