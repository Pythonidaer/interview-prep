import { Outlet, useLocation } from "react-router-dom";

import { AppNav } from "../components/AppNav";

import styles from "./AppLayout.module.css";

function isAiRolePath(pathname: string): boolean {
  return pathname === "/ai-role" || pathname.endsWith("/ai-role");
}

export default function AppLayout() {
  const { pathname } = useLocation();
  const acelab = isAiRolePath(pathname);

  return (
    <div
      className={acelab ? `${styles.layout} ${styles.layoutAcelab}` : styles.layout}
    >
      <AppNav acelabPage={acelab} />
      <Outlet />
    </div>
  );
}
