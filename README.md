# SecOps PR Checklist Action (MVP)

This GitHub Action scans pull requests for violations against a configurable security/privacy checklist, comments on the PR, and (mock) updates a Notion document for compliance tracking.

**Note:** LLM analysis and Notion integration are mocked in this MVP. All comments and Notion updates are static placeholders.

## Usage

1. Add a `.github/security-checklist.yml` to your repo (see example).
2. Add this action to your workflow or use the provided `action.yml`.

## Example Checklist
```yaml
checklist:
  - id: S1
    description: 'No hardcoded secrets (API keys, passwords)'
  - id: S2
    description: 'No use of deprecated crypto algorithms'
```

## What happens?
- On PR open/update, the action loads the checklist, mocks a scan, comments on the PR, and (mock) updates Notion.

tests
