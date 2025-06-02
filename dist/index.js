"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const checklist_1 = require("./checklist");
const notion_1 = require("./notion");
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
        const checklist = (0, checklist_1.loadChecklist)();
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
        await (0, notion_1.updateNotionChecklist)(prNumber, checklist, violations);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
