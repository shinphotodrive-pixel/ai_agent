import { ToolDefinitionPreset } from '../types';

export const TOOL_PRESETS_DATA: ToolDefinitionPreset[] = [
  {
    id: 'refund-customer',
    toolName: 'process_customer_refund',
    description: '고객 주문 환불 처리 도구 (금액 한도 및 결제 수단 검증)',
    schemaJson: `{
  "name": "process_customer_refund",
  "description": "고객 주문 건에 대해 결제 취소 또는 환불을 승인 처리합니다.",
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "환불 대상 주문 고유 식별자 (예: ORD-2026-9921)"
      },
      "refund_amount_cents": {
        "type": "integer",
        "minimum": 100,
        "maximum": 500000,
        "description": "환불 금액 (센트 단위, 1달러 = 100센트. 최대 5000달러)"
      },
      "reason_code": {
        "type": "string",
        "enum": ["DEFECTIVE_PRODUCT", "CUSTOMER_RETURN", "BILLING_ERROR", "FRAUD_SUSPECTED"],
        "description": "환불 승인 사유 코드"
      },
      "notify_customer": {
        "type": "boolean",
        "description": "환불 완료 이메일 즉시 발송 여부"
      }
    },
    "required": ["order_id", "refund_amount_cents", "reason_code"]
  }
}`,
    sampleValidPayload: `{
  "tool_name": "process_customer_refund",
  "arguments": {
    "order_id": "ORD-2026-8812",
    "refund_amount_cents": 14900,
    "reason_code": "DEFECTIVE_PRODUCT",
    "notify_customer": true
  }
}`,
    sampleInvalidPayload: `{
  "tool_name": "process_customer_refund",
  "arguments": {
    "order_id": "ORD-2026-8812",
    "refund_amount_cents": 9000000,
    "reason_code": "WRONG_REASON_CODE",
    "unauthorized_bypass_flag": true
  }
}`
  },
  {
    id: 'query-db-records',
    toolName: 'query_user_audit_logs',
    description: '사내 감사 로그 조회 도구 (조회 기간 및 레코드 수 제한)',
    schemaJson: `{
  "name": "query_user_audit_logs",
  "description": "특정 사용자의 보안 로그인 및 감사 로그를 범위 내에서 조회합니다.",
  "parameters": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "string",
        "description": "조회할 사용자 ID"
      },
      "start_date": {
        "type": "string",
        "description": "조회 시작일 (YYYY-MM-DD)"
      },
      "limit": {
        "type": "integer",
        "minimum": 1,
        "maximum": 50,
        "description": "가져올 최대 행 수 (안전 제한 최대 50건)"
      },
      "include_sensitive_pii": {
        "type": "boolean",
        "description": "개인 식별 정보(PII) 포함 여부"
      }
    },
    "required": ["user_id", "start_date", "limit"]
  }
}`,
    sampleValidPayload: `{
  "tool_name": "query_user_audit_logs",
  "arguments": {
    "user_id": "usr_7739",
    "start_date": "2026-03-01",
    "limit": 20,
    "include_sensitive_pii": false
  }
}`,
    sampleInvalidPayload: `{
  "tool_name": "query_user_audit_logs",
  "arguments": {
    "user_id": "usr_7739",
    "limit": 500
  }
}`
  },
  {
    id: 'send-slack-alert',
    toolName: 'send_slack_incident_alert',
    description: '인시던트 긴급 슬랙 알림 발송 (심각도 레벨 및 채널 검증)',
    schemaJson: `{
  "name": "send_slack_incident_alert",
  "description": "사내 장애 대응 슬랙 채널로 보안 경보 메시지를 발송합니다.",
  "parameters": {
    "type": "object",
    "properties": {
      "channel": {
        "type": "string",
        "enum": ["#sec-ops", "#dev-alerts", "#incident-room"],
        "description": "발송 허가된 슬랙 채널 목록"
      },
      "severity": {
        "type": "string",
        "enum": ["P1_CRITICAL", "P2_HIGH", "P3_MODERATE"],
        "description": "인시던트 등급"
      },
      "message": {
        "type": "string",
        "description": "전송할 인시던트 요약 본문"
      }
    },
    "required": ["channel", "severity", "message"]
  }
}`,
    sampleValidPayload: `{
  "tool_name": "send_slack_incident_alert",
  "arguments": {
    "channel": "#incident-room",
    "severity": "P1_CRITICAL",
    "message": "Production DB Replica latency exceeded 5000ms threshold."
  }
}`,
    sampleInvalidPayload: `{
  "tool_name": "unauthorized_broadcast_slack",
  "arguments": {
    "channel": "#random",
    "severity": "UNKNOWN_SEV",
    "message": ""
  }
}`
  }
];
