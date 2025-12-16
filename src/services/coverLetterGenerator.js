const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Generate a cover letter using Claude API
 * @param {Object} params - Generation parameters
 * @param {string} params.apiKey - Anthropic API key
 * @param {string} params.userName - User's full name
 * @param {string} params.userExperience - User's experience summary
 * @param {string} params.userSkills - User's key skills
 * @param {string} params.company - Company name
 * @param {string} params.role - Job role/position
 * @param {string} params.notes - Additional notes about the job
 * @param {string} params.tone - Tone preference (formal/casual/enthusiastic)
 * @returns {Promise<string>} Generated cover letter
 */
export async function generateCoverLetter({
  apiKey,
  userName,
  userExperience,
  userSkills,
  company,
  role,
  notes = '',
  tone = 'professional'
}) {
  const prompt = `Write a compelling cover letter for a job application with the following details:

**Applicant Information:**
- Name: ${userName}
- Key Experience: ${userExperience}
- Skills: ${userSkills}

**Job Details:**
- Company: ${company}
- Position: ${role}
${notes ? `- Additional Context: ${notes}` : ''}

**Requirements:**
- Tone: ${tone}
- Length: 3-4 paragraphs
- Focus on how my experience and skills match this specific role
- Show genuine interest in the company
- Be specific and avoid generic statements
- Include a strong opening and clear call to action
- Format it professionally

Please write the complete cover letter now.`;

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate cover letter');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw error;
  }
}

/**
 * Estimate the cost of generating a cover letter
 * @returns {string} Estimated cost range
 */
export function estimateCost() {
  return '$0.10 - $0.15 per letter';
}
