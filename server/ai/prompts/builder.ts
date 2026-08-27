/**
 * Multi Tube Views — Prompt Composition & TruthGuard Layer
 * Combines global system instructions, platform directives, factuality guardrails,
 * tool templates, user inputs, and output contracts into a coherent prompt.
 */

import { PromptProfile, SchemaDefinition, AICapability } from '../types.js';
import { PROMPT_PROFILES } from './profiles.js';

export const GLOBAL_SYSTEM_INSTRUCTION = `You are the Multi Tube Views (MTV) Universal AI Engine.
Owner / Brand: AiMAEditz (multitubeviews.com).
Your goal is to provide precise, actionable, high-quality, and strictly grounded content for creators, video editors, and digital marketers.

TRUTHGUARD FACTUALITY RULES:
1. Distinguish FACT from ASSUMPTION and UNCERTAINTY.
2. Never invent private platform creator analytics (views, watch time, revenue, CTR %).
3. When generating video chapters/timestamps, ground them strictly within the verified real video duration provided. Never hallucinate timestamps beyond video length.
4. If essential metadata is unavailable, explicitly declare "Data unavailable" rather than fabricating plausible-sounding placeholders.
5. Provide helpful, non-clickbait, authentic recommendations.`;

export interface PromptCompositionOptions {
  profileId?: string;
  toolPrompt?: string;
  systemInstruction?: string;
  capability?: AICapability;
  platform?: string;
  input?: Record<string, any>;
  outputSchema?: SchemaDefinition;
  factualityPolicy?: 'strict' | 'flexible' | 'creative';
}

export class PromptBuilder {
  /**
   * Interpolate {{key}} placeholders in template with input values
   */
  public static interpolate(template: string, input: Record<string, any> = {}): string {
    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
      const val = input[key];
      if (val === undefined || val === null || val === '') {
        return 'Data unavailable';
      }
      if (typeof val === 'object') {
        return JSON.stringify(val);
      }
      return String(val);
    });
  }

  /**
   * Assemble complete system instructions
   */
  public static buildSystemInstruction(options: PromptCompositionOptions): string {
    const parts: string[] = [GLOBAL_SYSTEM_INSTRUCTION];

    // Add profile system template if exists
    if (options.profileId && PROMPT_PROFILES[options.profileId]) {
      const profile = PROMPT_PROFILES[options.profileId];
      parts.push(profile.systemTemplate);

      // Add platform specific directive
      if (options.platform && profile.platformDirectives) {
        const pKey = options.platform.toLowerCase();
        const pDirective = profile.platformDirectives[pKey] || profile.platformDirectives.all;
        if (pDirective) {
          parts.push(`PLATFORM SPECIFIC DIRECTIVE (${options.platform.toUpperCase()}):\n${pDirective}`);
        }
      }
    }

    // Add custom system instruction if provided
    if (options.systemInstruction) {
      parts.push(options.systemInstruction);
    }

    // Add schema contract requirement if JSON output is expected
    if (options.outputSchema) {
      parts.push(`OUTPUT CONTRACT:\nYou MUST return strictly valid JSON matching the following schema properties: ${Object.keys(options.outputSchema.properties).join(', ')}. Do not wrap in markdown or backticks.`);
    } else {
      parts.push('Return clean, valid JSON formatted output.');
    }

    return parts.join('\n\n');
  }

  /**
   * Assemble user prompt
   */
  public static buildUserPrompt(options: PromptCompositionOptions): string {
    let baseUserTemplate = '';

    if (options.profileId && PROMPT_PROFILES[options.profileId]) {
      baseUserTemplate = PROMPT_PROFILES[options.profileId].userTemplate;
    } else if (options.toolPrompt) {
      baseUserTemplate = options.toolPrompt;
    } else {
      baseUserTemplate = 'Analyze the following input and generate structured results:\n' + JSON.stringify(options.input || {}, null, 2);
    }

    const inputData = { ...(options.input || {}) };
    if (options.platform && !inputData.platform) {
      inputData.platform = options.platform;
    }

    return this.interpolate(baseUserTemplate, inputData);
  }
}
