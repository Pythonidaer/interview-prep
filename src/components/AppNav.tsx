import { NavLink } from "react-router-dom";

import styles from "./AppNav.module.css";

const NAV_ITEMS = [
  { to: "/", label: "Interview Prep", end: true, acelabActive: false },
  { to: "/ai-role", label: "AI Role", end: true, acelabActive: true },
] as const;

type AppNavProps = {
  acelabPage?: boolean;
};

export function AppNav({ acelabPage = false }: AppNavProps) {
  return (
    <nav
      className={acelabPage ? `${styles.nav} ${styles.navAcelab}` : styles.nav}
      aria-label="Main"
    >
      <ul className={styles.list}>
        {NAV_ITEMS.map(({ to, label, end, acelabActive }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => {
                if (!isActive) return styles.link;
                return acelabActive
                  ? `${styles.link} ${styles.linkActiveAcelab}`
                  : `${styles.link} ${styles.linkActive}`;
              }}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
