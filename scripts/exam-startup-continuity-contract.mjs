import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = async (relativePath) => readFile(path.join(projectRoot, relativePath), 'utf8');
const requireText = (text, pattern, description) => assert.match(text, pattern, description);

const indexHtml = await source('index.html');
const main = await source('src/main.tsx');
const styles = await source('src/App.css');
const startupLoading = await source('src/component/Loading/StartupLoading.tsx');
const routeLoading = await source('src/component/Loading/RouteLoading.tsx');

requireText(indexHtml, /id="startup-loading"/, 'HTML must render the startup placeholder before React');
requireText(indexHtml, /src="\/Web_Logo\.svg"/, 'HTML must reuse the staged Web_Logo asset');
requireText(indexHtml, /aria-label="小試鴿手載入中"/, 'HTML placeholder needs an accessible loading name');
requireText(indexHtml, /media="print"\s+onload="this\.media='all'"/, 'Google Fonts must not block first paint');
requireText(indexHtml, /try\s*{[\s\S]*localStorage\.getItem\(['"]theme['"]\)[\s\S]*}\s*catch/, 'HTML theme lookup must tolerate unavailable storage');
requireText(indexHtml, /window\.examStartupProgress\s*=\s*\{start, stop\}/, 'HTML must expose the progress handoff');
requireText(indexHtml, /start\(0\.5\)/, 'HTML progress must stop at 50%');
requireText(indexHtml, /--exam-startup-progress/, 'HTML must store progress outside React root');
requireText(main, /createRoot\(/, 'React must still mount normally');
requireText(main, /examStartupProgress\?\.stop\(\)/, 'entry must stop the HTML animation even on deep links without StartupLoading');

requireText(startupLoading, /useEffect/, 'StartupLoading must start the React phase after mount');
requireText(startupLoading, /examStartupProgress\?\.start\(0\.9\)/, 'React progress must stop at 90%');
requireText(startupLoading, /return\s*\(\)\s*=>\s*examStartupProgress\?\.stop\(\)/, 'StartupLoading must clean up the animation on unmount');
requireText(startupLoading, /className="startup-loading"/, 'React and HTML must share the startup geometry');
requireText(startupLoading, /aria-label="小試鴿手載入中"/, 'React placeholder needs the same accessible loading name');

requireText(routeLoading, /role="status"/, 'Route loading must expose a status region');
requireText(routeLoading, /Loading/, 'Route loading must reuse the existing small spinner');
assert.doesNotMatch(routeLoading, /startup-loading/, 'Route loading must not reintroduce the full-screen startup mask');

requireText(styles, /\.startup-loading\s*{/, 'React stylesheet must provide the shared startup geometry');
requireText(styles, /\.startup-spinner\s*{/, 'React stylesheet must provide the shared spinner');
requireText(styles, /\.startup-track\s*{/, 'React stylesheet must provide the shared progress track');
requireText(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, 'React stylesheet must support reduced motion');

console.log('exam startup continuity contract: PASS');
