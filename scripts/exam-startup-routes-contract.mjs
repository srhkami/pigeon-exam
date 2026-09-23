import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const pages = source('src/lib/pages.tsx');
const features = source('src/features/index.ts');
const routes = source('src/routes/routes.tsx');
const home = source('src/features/Home/Home.tsx');

for (const name of ['SelectRandom', 'SelectPast', 'SelectRecords', 'EssayRandom', 'EssayQuestions', 'EssayQuestion', 'EssayRecords', 'Paper', 'PaperRecords', 'PaperRecord', 'Statistics', 'AnalyzeReport']) {
  assert.match(pages, new RegExp(`const ${name} = lazy\\(`), `${name} needs a route lazy boundary`);
  assert.doesNotMatch(features, new RegExp(`export \\{default as ${name}\\}`), `${name} must not enter through the features barrel`);
}
assert.match(routes, /StartupLoading/, 'home route has a continuous startup fallback');
assert.match(routes, /RouteLoading/, 'other lazy routes use a local content fallback');
assert.match(home, /isLoading\s*\?\s*null\s*:\s*<Info\s*\/>/, 'user_info only mounts after authentication finishes');
console.log('Exam 路由啟動契約通過');
