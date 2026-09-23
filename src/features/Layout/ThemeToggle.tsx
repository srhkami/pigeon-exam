import {useEffect, useState} from "react";
import {FiMoon, FiSun} from "react-icons/fi";
import {Button} from "@/component";

export default function ThemeToggle() {

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // 儲存空間可能被停用；與 HTML 啟動階段採相同安全預設。
    try {
      return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    // 每次主題變更時，更新 <html data-theme="">
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // 私密模式仍可切換目前頁面的主題。
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <Button style='ghost' shape='circle' className='ml-auto mr-2' onClick={toggleTheme}>
      {theme === "dark" ? <FiMoon className='text-lg'/> : <FiSun className='text-lg'/>}
    </Button>
  );
}