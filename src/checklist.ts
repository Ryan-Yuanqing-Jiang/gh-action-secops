import * as fs from 'fs';
import * as yaml from 'js-yaml';

export interface ChecklistItem {
  id: string;
  description: string;
}

export function loadChecklist(path = '.github/security-checklist.yml'): ChecklistItem[] {
  const file = fs.readFileSync(path, 'utf8');
  const doc = yaml.load(file) as { checklist: ChecklistItem[] };
  return doc.checklist || [];
} 