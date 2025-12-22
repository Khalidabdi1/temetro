import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "@/onboarded/layout";
import Home from "@/home/home";
import Pageone from "@/onboarded/pageone";
import Pagetwo from "@/onboarded/pagetwo";
import Pagethree from "@/onboarded/pagetheree";

export default function AppRouters() {


  return (

    <HashRouter>
      <Routes>
        {/* المسار الرئيسي يقوم بفحص حالة المستخدم داخل الـ Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
        </Route>

        {/* مسارات الـ Onboarding يجب أن تكون خارج تحكم الـ Layout الذي يعيد التوجيه */}
        <Route path="onboarded/pageone" element={<Pageone />} />
        <Route path="onboarded/pagetwo" element={<Pagetwo />} />
        <Route path="onboarded/pagethree" element={<Pagethree />} />
      </Routes>
    </HashRouter>
    
  );
}