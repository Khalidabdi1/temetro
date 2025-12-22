import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function Layout() {
  const [firstRun, setFirstRun] = useState<boolean | null>(null);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem("hasOnboarded");
    setFirstRun(!hasOnboarded);
  }, []);

  if (firstRun === null) return <h1>loading...</h1>;

  // إذا كان المستخدم جديداً، انقله لصفحة التعريف
  if (firstRun) {
    return <Navigate to="/onboarded/pageone" replace />;
  }

  // إذا كان قديماً، اعرض المحتوى (Home)
  return <Outlet />;
}
