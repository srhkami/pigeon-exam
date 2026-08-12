import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
import {resolve} from "node:path";

const root = process.cwd();
const source = (path) => readFileSync(resolve(root, path), "utf8");
const apiError = source("src/func/api-error.ts");
const toast = source("src/func/toast.ts");
const form = source("src/func/form.ts");
const errorAdapter = source("src/func/error.tsx");
const index = source("src/func/index.ts");
const featuresIndex = source("src/features/index.ts");
const userTypes = source("src/types/user-types.ts");

const retiredFiles = [
  "src/func/copy.tsx",
  "src/hooks/useCacheApi.tsx",
  "src/hooks/useDataBrowser.tsx",
  "src/features/Feedback/FeedbackWeb.tsx",
  "src/features/Link/FileLink/ModalSelectFile.tsx",
  "src/features/Paper/for-manager/Manage/ModalQuestionToText.tsx",
  "src/features/User/Login/BtnEmailCode.tsx",
  "src/features/User/Login/EmailForm.tsx",
  "src/features/User/Login/PasswordForm.tsx",
  "src/features/User/UserProfile/MenuUser.tsx",
  "src/features/User/UserProfile/UserProfile.tsx",
  "src/features/FilePreview/FilePreview.tsx",
];

for (const path of retiredFiles) {
  assert.doesNotMatch(source(path), /\berrorLogger\b/, `${path} must not call errorLogger`);
}

assert.match(apiError, /export\s+(?:default\s+)?function\s+getUserFacingErrorMessage/, "missing safe error helper");
assert.match(apiError, /status.*key.*context.*value|status.*context.*key.*value/s, "server messages require four-part whitelist");
assert.match(apiError, /codeMessages/, "code messages must be explicitly whitelisted");
assert.doesNotMatch(apiError, /collectMessages|Object\.values|JSON\.stringify|\.message\b|\.config\b|\.request\b|\.stack\b/, "safe helper must not traverse or expose raw errors");
assert.doesNotMatch(apiError, /\brespose\b/, "safe helper must not accept the legacy respose spelling");
assert.doesNotMatch(toast, /JSON\.stringify|Object\.values|\.detail\b|\.code\b/, "toast must delegate to the safe helper");
assert.doesNotMatch(toast, /\brespose\b/, "toast must not accept the legacy respose spelling");
assert.doesNotMatch(form, /console\.log|Object\.entries|Object\.values/, "form helper must not expose arbitrary server fields");
assert.doesNotMatch(form, /\brespose\b/, "form helper must not accept the legacy respose spelling");
assert.doesNotMatch(errorAdapter, /console\.|ErrorLogToast|errorLogger/, "error adapter must be a safe toast adapter");
assert.doesNotMatch(index, /errorLogger/, "errorLogger must not be exported");
assert.doesNotMatch(featuresIndex, /ErrorLogToast/, "ErrorLogToast must not be exported");
assert.equal(existsSync(resolve(root, "src/features/Layout/ErrorLogToast.tsx")), false, "ErrorLogToast file must be deleted");
assert.doesNotMatch(userTypes, /error_log_count/, "retired error log count must be removed");

const allTouchedSource = [apiError, toast, form, errorAdapter, index, featuresIndex, userTypes, ...retiredFiles.map(source)].join("\n");
for (const forbidden of ["/feedback/error/send/", "回報作者", "ErrorLogToast"]) {
  assert.equal(allTouchedSource.includes(forbidden), false, `${forbidden} must be absent`);
}

// Contract matrix: only an exact status/key/context/value mapping may reach the UI.
const serverMessages = {
  400: {
    code: {
      "email-code": {
        "EMAIL_NOT_FOUND": "查無此信箱，請確認後再試。",
      },
    },
  },
};
const resolveWhitelistedMessage = ({status, key, context, value}, fallback) =>
  serverMessages[status]?.[key]?.[context]?.[value] ?? fallback;

assert.equal(resolveWhitelistedMessage({status: 400, key: "code", context: "email-code", value: "EMAIL_NOT_FOUND"}, "fallback"), "查無此信箱，請確認後再試。");
assert.equal(resolveWhitelistedMessage({status: 400, key: "code", context: "email-code", value: "[REDACTED]"}, "fallback"), "fallback");
assert.equal(resolveWhitelistedMessage({status: 400, key: "detail", context: "email-code", value: "EMAIL_NOT_FOUND"}, "fallback"), "fallback");
assert.equal(resolveWhitelistedMessage({status: 500, key: "code", context: "email-code", value: "EMAIL_NOT_FOUND"}, "fallback"), "fallback");

console.log("errorlog-retirement contract: PASS");
