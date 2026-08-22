import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBuilding,
  faUsers,
  faClockRotateLeft,
  faPlus,
  faRightFromBracket,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-[13px] font-medium transition ${
      isActive
        ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)]"
    }`;

  return (
    <aside className="flex fixed left-0 top-0 z-50 h-screen w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-white">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2">
          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-[9px]
              bg-[var(--color-primary)]
              text-[12px]
              font-semibold
              text-white
            "
          >
            RB
          </div>

          <span className="text-[17px] font-semibold text-[var(--color-text-primary)]">
            RoleBase
          </span>
        </div>
      </div>

      {/* Workspace selector */}
      <div className="px-4">
        <button
          type="button"
          className="
            flex w-full
            items-center justify-between
            rounded-[9px]
            border border-[var(--color-border)]
            bg-white
            px-3 py-2.5
            text-left
            transition
            hover:bg-[var(--color-surface-alt)]
          "
        >
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="
                flex h-7 w-7 shrink-0
                items-center justify-center
                rounded-[7px]
                bg-[var(--color-primary-light)]
                text-[10px]
                font-semibold
                text-[var(--color-primary)]
              "
            >
              WS
            </div>

            <span className="max-w-[150px] truncate text-[13px] font-medium text-[var(--color-text-primary)]">
              My Workspace
            </span>
          </div>

          <FontAwesomeIcon
            icon={faChevronDown}
            className="ml-2 text-[11px] text-[var(--color-text-muted)]"
          />
        </button>

        {/* Create workspace */}
        <button
          type="button"
          onClick={() => navigate("/dashboard/create-workspace")}
          className="
            mt-2
            flex w-full
            items-center gap-3
            rounded-[9px]
            px-3 py-2.5
            text-[13px]
            font-medium
            text-[var(--color-text-secondary)]
            transition
            hover:bg-[var(--color-primary-light)]
            hover:text-[var(--color-primary)]
          "
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 text-[12px]" />
          Create workspace
        </button>
      </div>

      {/* Navigation */}
      <div className="mt-7 px-4">
        <p
          className="
            mb-2 px-3
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[var(--color-text-muted)]
          "
        >
          Settings
        </p>

        <nav className="space-y-1">
          <NavLink to="/dashboard/profile" className={navLinkClass}>
            <FontAwesomeIcon icon={faUser} className="w-4 text-[12px]" />
            Profile
          </NavLink>

          <NavLink to="/dashboard/workspace" className={navLinkClass}>
            <FontAwesomeIcon icon={faBuilding} className="w-4 text-[12px]" />
            Workspace
          </NavLink>

          <NavLink to="/dashboard/members" className={navLinkClass}>
            <FontAwesomeIcon icon={faUsers} className="w-4 text-[12px]" />
            Members
          </NavLink>
        </nav>

        {/* Activity */}
        <p
          className="
            mb-2 mt-7 px-3
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[var(--color-text-muted)]
          "
        >
          Activity
        </p>

        <NavLink to="/dashboard/activity" className={navLinkClass}>
          <FontAwesomeIcon
            icon={faClockRotateLeft}
            className="w-4 text-[12px]"
          />
          Activity
        </NavLink>
      </div>

      {/* Bottom */}
      <div className="mt-auto border-t border-[var(--color-border)] p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex w-full
            items-center gap-3
            rounded-[9px]
            px-3 py-2.5
            text-[13px]
            font-medium
            text-[var(--color-text-secondary)]
            transition
            hover:bg-[var(--color-danger-bg)]
            hover:text-[var(--color-danger)]
          "
        >
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="w-4 text-[12px]"
          />
          Sign out
        </button>
      </div>
    </aside>
  );
}