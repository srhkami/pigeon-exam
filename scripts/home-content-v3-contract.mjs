// C2 離線元件契約；不啟動瀏覽器或真實 HTTP。
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const hand = false;
const relative = hand ? 'src/features/Home/HomeContent.tsx' : 'src/features/Home/Announcement.tsx';
function render(values) {
  const calls = [];
  const jsx = (type, props) => ({type, props});
  const source = readFileSync(root + relative, 'utf8');
  const {outputText} = ts.transpileModule(source, {compilerOptions: {jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: false}});
  const module = {exports: {}};
  const require = name => {
    if (name === 'react/jsx-runtime') return {jsx, jsxs: jsx};
    if (name === '@/hooks') return {useCacheApi: config => {calls.push(config); return {data: values[calls.length-1], loading: false, error: null};}};
    if (name === '@/lib/config.ts') return {ROOT_IP: 'https://offline.invalid', V3_API: 'https://offline.invalid/v3', WEB_API: 'https://offline.invalid/web', MEDIA_IP: 'https://media.invalid'};
    if (name === 'react-router') return {Link: 'Link'};
    if (name.startsWith('./Home')) return {default: name.slice(2)};
    throw Error(name);
  };
  vm.runInNewContext(outputText, {module, exports: module.exports, require});
  const nodes=[];
  const visit=n => {if (!n || typeof n !== 'object') return; if (Array.isArray(n)) return n.forEach(visit); nodes.push(n); visit(n.props?.children);};
  visit(module.exports.default());
  return {calls,nodes,source};
}
const image={id:'legacy-id',src:'/media/original.png',alt:'既有圖片',link:'/existing'};
const notice={id:'notice-id',date:'2026-10-21',text:'第一行\n第二行',link:'/existing'};

test('既有元件只讀 V3 並解開 key/value，保留內容與順序',()=>{
  const keys = hand ? ['pigeon-hand-images','pigeon-hand-notice'] : ['pigeon-exam-notice'];
  const values = hand ? [[image],[notice]] : [[notice]];
  const x=render(keys.map((key,i)=>({key,value:values[i]})));
  assert.equal(x.calls.length,keys.length);
  keys.forEach((key,i)=>assert.equal(x.calls[i].url,'https://offline.invalid/v3/web/cache?key='+key));
  if (hand) {
    assert.equal(JSON.stringify(x.nodes.find(n=>n.type==='HomeCarousel').props.images),JSON.stringify([image]));
    assert.equal(JSON.stringify(x.nodes.find(n=>n.type==='HomeAnnouncements').props.notices),JSON.stringify([notice]));
  } else {
    assert.equal(x.nodes.find(n=>n.type==='Link').props.to,notice.link);
    assert.ok(x.nodes.some(n=>n.props?.children===notice.text));
  }
  assert.ok(!x.source.includes('/cache/get/'));
});

test('載入前與空內容仍保留既有空清單呈現',()=>{
  for (const data of [null,{value:[]}]) {
    const x=render(hand?[data,data]:[data]);
    if (hand) assert.equal(x.nodes.find(n=>n.type==='HomeCarousel').props.images.length,0);
    else assert.equal(x.nodes.filter(n=>n.type==='Link').length,0);
  }
});
