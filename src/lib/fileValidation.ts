export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['application/json'];
export const MAX_NODE_COUNT = 10000;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFile(file: File): ValidationResult {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type) && !file.name.endsWith('.json')) {
    return {
      isValid: false,
      error: 'Please upload a valid JSON file'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  // Check file name for potential security issues
  const dangerousPatterns = [
    /\.\./,  // Directory traversal
    /[<>:"|?*]/,  // Invalid characters
    /^\./, // Hidden files
  ];

  if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
    return {
      isValid: false,
      error: 'Invalid file name'
    };
  }

  return { isValid: true };
}

export async function validateJSONContent(content: string): Promise<ValidationResult> {
  try {
    // First, check if it's valid JSON
    const parsed = JSON.parse(content);
    
    // Check for potential security issues
    const stringified = JSON.stringify(parsed);
    
    // Prevent extremely large JSON that could cause DoS
    if (stringified.length > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'JSON content is too large'
      };
    }

    // Basic structure validation for workflow files
    if (typeof parsed !== 'object' || parsed === null) {
      return {
        isValid: false,
        error: 'Invalid workflow structure'
      };
    }

    // Count nodes safely with depth limit
    const nodeCount = countNodesSecurely(parsed);
    if (nodeCount > MAX_NODE_COUNT) {
      return {
        isValid: false,
        error: `Workflow exceeds maximum node limit of ${MAX_NODE_COUNT}`
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid JSON format'
    };
  }
}

function countNodesSecurely(obj: unknown, depth = 0, maxDepth = 20): number {
  if (depth > maxDepth) {
    throw new Error('JSON structure too deep');
  }

  let count = 0;
  
  if (!obj || typeof obj !== 'object' || obj === null) {
    return 0;
  }
  
  const record = obj as Record<string, unknown>;
  
  // Handle n8n workflow format
  if (record.nodes && Array.isArray(record.nodes)) {
    return record.nodes.length;
  }
  
  // Handle Zapier/Make format (recursive counting)
  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      const value = record[key];
      if (typeof value === 'object' && value !== null) {
        count += countNodesSecurely(value, depth + 1, maxDepth);
      }
    }
  }
  
  // If we found nodes at this level
  if (record.type || record.action || record.module) {
    count++;
  }
  
  return count;
}

export function sanitizeFileName(fileName: string): string {
  // Remove any potentially dangerous characters
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '_')
    .substring(0, 255); // Limit length
}