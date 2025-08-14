// The 'use server' directive is crucial for server-side execution in Next.js.
'use server';

/**
 * @fileOverview AI-powered UI component generator from smart contract ABIs.
 *
 * - generateUIComponents - A function that generates UI components based on contract ABIs.
 * - GenerateUIComponentsInput - The input type for the generateUIComponents function.
 * - GenerateUIComponentsOutput - The return type for the generateUIComponents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUIComponentsInputSchema = z.object({
  abi: z.string().describe('The ABI of the smart contract as a JSON string.'),
  contractName: z.string().describe('The name of the smart contract.'),
  primaryColor: z.string().default('#247BA0').describe('The primary color for the UI.'),
  backgroundColor: z.string().default('#F5F7FA').describe('The background color for the UI.'),
  accentColor: z.string().default('#7044ff').describe('The accent color for the UI.'),
  bodyFont: z.string().default('Inter').describe('The font for body text and headlines.'),
  codeFont: z.string().default('Source Code Pro').describe('The font for displaying code.'),
});
export type GenerateUIComponentsInput = z.infer<typeof GenerateUIComponentsInputSchema>;

const GenerateUIComponentsOutputSchema = z.object({
  components: z.string().describe('The generated UI components as a string of JSX code.'),
});
export type GenerateUIComponentsOutput = z.infer<typeof GenerateUIComponentsOutputSchema>;

export async function generateUIComponents(input: GenerateUIComponentsInput): Promise<GenerateUIComponentsOutput> {
  return generateUIComponentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUIComponentsPrompt',
  input: {schema: GenerateUIComponentsInputSchema},
  output: {schema: GenerateUIComponentsOutputSchema},
  prompt: `You are an AI UI component generator expert specializing in creating React components for interacting with smart contracts.

  Based on the provided smart contract ABI, generate a set of React components using Next.js 14 (App Router), TailwindCSS, Wagmi, and RainbowKit.
  Consider the following UI style guidelines:
  - Primary color: {{{primaryColor}}}
  - Background color: {{{backgroundColor}}}
  - Accent color: {{{accentColor}}}
  - Body and headline font: {{{bodyFont}}}
  - Code font: {{{codeFont}}}

  Here's the ABI of the smart contract:
  \`\`\`
  {{{abi}}}
  \`\`\`

  Contract Name: {{{contractName}}}

  Ensure that the generated components include:
  - Dynamic forms for interacting with contract functions, handling different input types (address, uint256, string, etc.).
  - Display components for showing fetched data from the contract in a structured and user-friendly format.
  - Appropriate testing stubs and sample calls.

  Return the generated UI components as a string of JSX code.
`,
});

const generateUIComponentsFlow = ai.defineFlow(
  {
    name: 'generateUIComponentsFlow',
    inputSchema: GenerateUIComponentsInputSchema,
    outputSchema: GenerateUIComponentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);







