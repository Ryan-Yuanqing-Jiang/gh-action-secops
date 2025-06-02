import * as core from '@actions/core';
import * as github from '@actions/github';
import { loadChecklist } from './checklist';
import { updateNotionChecklist } from './notion';

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN || core.getInput('GITHUB_TOKEN');
    if (!token) {
      core.setFailed('GITHUB_TOKEN is required');
      return;
    }
    const octokit = github.getOctokit(token);
    const context = github.context;
    const pr = context.payload.pull_request;
    if (!pr) {
      core.info('No pull request found. Exiting.');
      return;
    }
    const prNumber = pr.number;
    const checklist = loadChecklist();

    // Mock scan: always flag S1 as violated
    const violations = checklist.length > 0 ? [checklist[0].id] : [];

    // Post static comment
    const body = `🔒 **SecOps Checklist Scan (MVP)**\n\n` +
      (violations.length > 0
        ? `❌ Violations found:\n${violations.map(id => `- ${id}`).join('\n')}`
        : '✅ All checklist items passed!') +
      `\n\n_(LLM and Notion integration are mocked in this MVP)_`;

    await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: prNumber,
      body,
    });

    // Mock Notion update
    await updateNotionChecklist(prNumber, checklist, violations);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run(); 