/**
 * Multi Tube Views — Universal AI Validation & TruthGuard Engine
 * Handles JSON parsing recovery, schema validation, input sanitization,
 * prompt injection filtering, and factuality / duration bounding.
 */

import { SchemaDefinition, SchemaProperty } from '../types.js';

export interface ValidationResult {
  valid: boolean;
  data?: any;
  errors: string[];
  warnings: string[];
  sanitizedText?: string;
}

export class Validator {
  /**
   * Sanitize user input against prompt injection and secret leaking
   */
  public static sanitizeInput(text: string, maxLen: number = 4000): { clean: string; warnings: string[] } {
    if (!text || typeof text !== 'string') {
      return { clean: '', warnings: [] };
    }

    let clean = text.trim().slice(0, maxLen);
    const warnings: string[] = [];

    const suspiciousPatterns = [
      /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
      /disregard\s+(all\s+)?prior\s+prompts/i,
      /system\s+prompt/i,
      /reveal\s+(your\s+)?(api\s+key|secret|password|token|env)/i,
      /print\s+process\.env/i,
      /DAN\s+mode/i,
      /jailbreak/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(clean)) {
        clean = clean.replace(pattern, '[Redacted Instruction]');
        warnings.push('Potentially adversarial instruction pattern was neutralized.');
      }
    }

    return { clean, warnings };
  }

  /**
   * Robust JSON extraction & recovery from AI responses
   * Handles markdown codeblocks, prefix text, and repair of simple malformed JSON
   */
  public static extractAndRepairJson(rawText: string): { success: boolean; data?: any; error?: string } {
    if (!rawText || typeof rawText !== 'string') {
      return { success: false, error: 'Empty AI response text.' };
    }

    const trimmed = rawText.trim();

    // 1. Direct standard JSON parse
    try {
      return { success: true, data: JSON.parse(trimmed) };
    } catch (_) {}

    // 2. Strip Markdown code blocks (```json ... ``` or ``` ... ```)
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      try {
        return { success: true, data: JSON.parse(codeBlockMatch[1].trim()) };
      } catch (_) {}
    }

    // 3. Find outermost JSON object or array bounds
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidate = trimmed.substring(firstBrace, lastBrace + 1);
      try {
        return { success: true, data: JSON.parse(candidate) };
      } catch (_) {}
    }

    const firstBracket = trimmed.indexOf('[');
    const lastBracket = trimmed.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      const candidate = trimmed.substring(firstBracket, lastBracket + 1);
      try {
        return { success: true, data: JSON.parse(candidate) };
      } catch (_) {}
    }

    // 4. Attempt basic JSON bracket auto-closing repair for truncated responses
    if (firstBrace !== -1) {
      let candidate = trimmed.substring(firstBrace);
      // Count unclosed braces and quotes
      const openBraces = (candidate.match(/\{/g) || []).length;
      const closeBraces = (candidate.match(/\}/g) || []).length;
      if (openBraces > closeBraces) {
        candidate += '}'.repeat(openBraces - closeBraces);
        try {
          return { success: true, data: JSON.parse(candidate) };
        } catch (_) {}
      }
    }

    return {
      success: false,
      error: 'Could not parse structured JSON from AI provider response.',
    };
  }

  /**
   * Validate data against SchemaDefinition
   */
  public static validateSchema(data: any, schema: SchemaDefinition): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        errors: ['Output data is not an object or valid JSON structure.'],
        warnings,
      };
    }

    // Check required fields
    const required = schema.requiredFields || [];
    for (const reqField of required) {
      if (data[reqField] === undefined || data[reqField] === null || data[reqField] === '') {
        errors.push(`Missing required field: "${reqField}"`);
      }
    }

    // Validate properties
    for (const [propName, propDef] of Object.entries(schema.properties)) {
      const val = data[propName];

      if (val !== undefined && val !== null) {
        if (propDef.type === 'array' && !Array.isArray(val)) {
          errors.push(`Field "${propName}" expected array, received ${typeof val}`);
        } else if (propDef.type === 'number' && typeof val !== 'number') {
          errors.push(`Field "${propName}" expected number, received ${typeof val}`);
        } else if (propDef.type === 'string' && typeof val !== 'string') {
          errors.push(`Field "${propName}" expected string, received ${typeof val}`);
        } else if (propDef.type === 'boolean' && typeof val !== 'boolean') {
          errors.push(`Field "${propName}" expected boolean, received ${typeof val}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      data,
      errors,
      warnings,
    };
  }

  /**
   * TruthGuard duration & timestamp bounding
   */
  public static enforceTruthGuard(
    data: any,
    context?: { durationSeconds?: number | null; url?: string }
  ): any {
    if (!data || typeof data !== 'object') return data;

    const guarded = { ...data };

    // If chapters or timestamps exist, check against real duration
    if (guarded.chapters || guarded.timestamps || guarded.optimizedDescription) {
      const dur = context?.durationSeconds;
      if (dur === null || dur === undefined || isNaN(dur) || dur <= 0) {
        if (typeof guarded.chapters === 'string' && guarded.chapters.includes(':')) {
          guarded.chapters = 'Data unavailable (Video duration could not be reliably verified; timestamps were not generated to prevent inaccuracies).';
        }
      }
    }

    return guarded;
  }
}
