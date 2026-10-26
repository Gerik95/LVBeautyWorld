import { THEME_KEY } from "@/lib/storage";

const source = `(function(){try{var k=${JSON.stringify(THEME_KEY)};var t=localStorage.getItem(k)||'system';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='dark'||(t!=='light'&&d)?'dark':'light';var e=document.documentElement;e.dataset.theme=r;e.style.colorScheme=r;}catch(e){}})();`;

export const ThemeScript = () => (
  <script dangerouslySetInnerHTML={{ __html: source }} />
);
