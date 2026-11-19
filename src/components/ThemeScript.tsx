import { INITIAL_THEME_KEY, SERVICE_SEEN_KEY, SKIN_KEY, THEME_KEY } from "@/lib/storage";
import { campaignScript } from "@/lib/campaign";
import { getActiveSkin, optInSkins, resolveEffects } from "@/skins";

const effects = resolveEffects(getActiveSkin());
const skinId = getActiveSkin().id;

const source = `(function(){try{
  var e=document.documentElement;
  e.dataset.svc='on';
  try{if(sessionStorage.getItem(${JSON.stringify(SERVICE_SEEN_KEY)})==='1')e.dataset.svcSeen='1';}catch(err){}
  var k=${JSON.stringify(THEME_KEY)};
  var stored=localStorage.getItem(k)||'system';
  var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme=stored==='dark'||(stored!=='light'&&dark)?'dark':'light';
  e.dataset.theme=theme;
  e.style.colorScheme=theme;
  e.dataset.skin=${JSON.stringify(skinId)};
  try{var s=localStorage.getItem(${JSON.stringify(SKIN_KEY)});if(${JSON.stringify(optInSkins)}.indexOf(s)>=0)e.dataset.skin=s;}catch(err){}
  try{${campaignScript()}}catch(err){}
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce) e.classList.add('js');
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(fine&&!reduce)e.dataset.svcWave='on';
  else delete e.dataset.svcWave;
  var initial=null;
  try{initial=sessionStorage.getItem(${JSON.stringify(INITIAL_THEME_KEY)});}catch(err){initial=null;}
  if(!initial){
    initial=theme;
    try{sessionStorage.setItem(${JSON.stringify(INITIAL_THEME_KEY)},initial);}catch(err){}
  }
  window.__lvbwInitialTheme=initial;
  var lamp=${effects.lampIgnition || effects.spotlight ? "true" : "false"};
  if(reduce||!lamp){e.dataset.lamp='steady';}
  else{e.dataset.lamp='arm';}
}catch(err){
  var root=document.documentElement;
  root.dataset.svc='on';
  if(!root.dataset.theme){root.dataset.theme='light';root.style.colorScheme='light';}
  root.dataset.lamp='steady';
}})();`;

export const ThemeScript = () => <script dangerouslySetInnerHTML={{ __html: source }} />;
