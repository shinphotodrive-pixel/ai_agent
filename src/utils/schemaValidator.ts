import { SchemaValidationReport, ValidationIssue } from '../types';

export function validateToolInvocation(
  schemaStr: string,
  payloadStr: string
): SchemaValidationReport {
  // 1. JSON Parse check
  let parsedSchema: any;
  let parsedPayload: any;

  try {
    parsedSchema = JSON.parse(schemaStr);
  } catch (err: any) {
    return {
      isValid: false,
      toolName: 'unknown',
      issues: [
        {
          path: 'schema',
          errorType: 'JSON_SYNTAX_ERROR',
          message: `스키마 JSON 문법 오류: ${err.message}`,
          expected: 'Valid JSON Schema',
          received: 'Invalid JSON String'
        }
      ],
      executionStatus: 'SYNTAX_REJECTED'
    };
  }

  try {
    parsedPayload = JSON.parse(payloadStr);
  } catch (err: any) {
    return {
      isValid: false,
      toolName: 'unknown',
      issues: [
        {
          path: 'payload',
          errorType: 'JSON_SYNTAX_ERROR',
          message: `호출 페이로드 JSON 문법 오류: ${err.message}`,
          expected: 'Valid JSON Object',
          received: 'Invalid JSON String'
        }
      ],
      executionStatus: 'SYNTAX_REJECTED'
    };
  }

  const issues: ValidationIssue[] = [];
  const expectedToolName = parsedSchema.name || parsedSchema.title || 'unnamed_tool';
  const receivedToolName = parsedPayload.tool_name || parsedPayload.name || '';

  // 2. Tool Name Matching
  if (!receivedToolName) {
    issues.push({
      path: 'tool_name',
      errorType: 'MISSING_REQUIRED',
      message: '호출할 도구 이름(tool_name)이 명시되지 않았습니다.',
      expected: expectedToolName,
      received: 'undefined'
    });
  } else if (receivedToolName !== expectedToolName) {
    issues.push({
      path: 'tool_name',
      errorType: 'UNAUTHORIZED_TOOL',
      message: `허가된 도구 이름과 일치하지 않습니다: '${receivedToolName}' vs '${expectedToolName}'`,
      expected: expectedToolName,
      received: receivedToolName
    });
  }

  // 3. Parameters / Arguments validation
  const properties = parsedSchema.parameters?.properties || parsedSchema.properties || {};
  const requiredFields: string[] = parsedSchema.parameters?.required || parsedSchema.required || [];
  const actualArgs = parsedPayload.arguments || parsedPayload.parameters || {};

  // Check required fields
  for (const field of requiredFields) {
    if (actualArgs[field] === undefined || actualArgs[field] === null || actualArgs[field] === '') {
      issues.push({
        path: `arguments.${field}`,
        errorType: 'MISSING_REQUIRED',
        message: `필수 파라미터 '${field}'가 누락되었거나 비어 있습니다.`,
        expected: `Defined value (${properties[field]?.type || 'any'})`,
        received: actualArgs[field] === undefined ? 'undefined' : 'empty'
      });
    }
  }

  // Check types and constraints
  for (const [key, val] of Object.entries(actualArgs)) {
    const propSchema = properties[key];
    if (!propSchema) {
      // extra unexpected argument
      issues.push({
        path: `arguments.${key}`,
        errorType: 'UNAUTHORIZED_TOOL',
        message: `스키마에 정의되지 않은 알 수 없는 매개변수 '${key}'입니다.`,
        expected: 'Allowed property in schema',
        received: key
      });
      continue;
    }

    const expectedType = propSchema.type;
    const actualType = Array.isArray(val) ? 'array' : typeof val;

    if (expectedType && expectedType !== actualType) {
      if (!(expectedType === 'integer' && typeof val === 'number' && Number.isInteger(val))) {
        issues.push({
          path: `arguments.${key}`,
          errorType: 'TYPE_MISMATCH',
          message: `'${key}'의 타입이 맞지 않습니다.`,
          expected: expectedType,
          received: actualType
        });
      }
    }

    // Number ranges
    if (typeof val === 'number') {
      if (propSchema.minimum !== undefined && val < propSchema.minimum) {
        issues.push({
          path: `arguments.${key}`,
          errorType: 'RANGE_VIOLATION',
          message: `'${key}' 값이 허용 최솟값(${propSchema.minimum})보다 작습니다.`,
          expected: `>= ${propSchema.minimum}`,
          received: String(val)
        });
      }
      if (propSchema.maximum !== undefined && val > propSchema.maximum) {
        issues.push({
          path: `arguments.${key}`,
          errorType: 'RANGE_VIOLATION',
          message: `'${key}' 값이 안전 최댓값(${propSchema.maximum})을 초과했습니다.`,
          expected: `<= ${propSchema.maximum}`,
          received: String(val)
        });
      }
    }

    // Enum check
    if (propSchema.enum && Array.isArray(propSchema.enum)) {
      if (!propSchema.enum.includes(val)) {
        issues.push({
          path: `arguments.${key}`,
          errorType: 'RANGE_VIOLATION',
          message: `'${key}' 값이 허용된 열거형(Enum) 목록에 없습니다.`,
          expected: `One of [${propSchema.enum.join(', ')}]`,
          received: String(val)
        });
      }
    }
  }

  // Generate Auto-Repaired Payload
  const repairedArgs: Record<string, any> = { ...actualArgs };
  for (const field of requiredFields) {
    if (repairedArgs[field] === undefined) {
      const type = properties[field]?.type;
      if (type === 'string') repairedArgs[field] = properties[field]?.default || 'default_value';
      else if (type === 'integer' || type === 'number') repairedArgs[field] = properties[field]?.minimum || 1;
      else if (type === 'boolean') repairedArgs[field] = false;
      else if (type === 'array') repairedArgs[field] = [];
      else repairedArgs[field] = null;
    }
  }

  // Remove unauthorized fields
  for (const key of Object.keys(repairedArgs)) {
    if (!properties[key]) {
      delete repairedArgs[key];
    }
  }

  const repairedObj = {
    tool_name: expectedToolName,
    arguments: repairedArgs
  };

  const isValid = issues.length === 0;

  return {
    isValid,
    toolName: expectedToolName,
    issues,
    repairedPayload: JSON.stringify(repairedObj, null, 2),
    executionStatus: isValid ? 'READY_TO_DISPATCH' : 'BLOCKED_BY_GUARDRAIL'
  };
}
