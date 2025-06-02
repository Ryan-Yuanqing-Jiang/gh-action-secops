import { ChecklistItem } from './checklist';

export async function updateNotionChecklist(prNumber: number, checklist: ChecklistItem[], violations: string[]): Promise<void> {
  // Mock: just log what would be sent to Notion
  console.log(`[MOCK] Updating Notion for PR #${prNumber}`);
  checklist.forEach(item => {
    const status = violations.includes(item.id) ? '❌ Violated' : '✅ Met';
    console.log(`- [${status}] ${item.id}: ${item.description}`);
  });
} 