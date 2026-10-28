import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { profilesApi } from "@/api/profiles";
import { applicationsApi } from "@/api/applications";
import { useAuthStore } from "@/store/authStore";

const Ring = ({
  percent,
  children,
}: {
  percent: number;
  children: ReactNode;
}) => {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 88 88" className="absolute inset-0 -rotate-90">
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          strokeWidth="5"
          className="stroke-slate-200"
        />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
          className="stroke-amber-500"
        />
      </svg>
      <div className="absolute inset-[9px] overflow-hidden rounded-full">
        {children}
      </div>
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white px-1 text-xs font-semibold text-amber-600">
        {percent}%
      </span>
    </div>
  );
};

const icons = {
  bookmark: "M6 3h12v18l-6-4-6 4V3Z",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8ZM10.3 20a2 2 0 0 0 3.4 0",
  trophy:
    "M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H4v1a3 3 0 0 0 4 3M16 6h4v1a3 3 0 0 1-4 3M12 13v4M8 21h8M10 17h4",
  guide: "M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.5M12 17h.01",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
} as const;

const Icon = ({ name }: { name: keyof typeof icons }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={icons[name]} />
  </svg>
);

const MenuLink = ({
  to,
  label,
  icon,
  onClick,
}: {
  to: string;
  label: string;
  icon: keyof typeof icons;
  onClick: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-4 py-3.5 text-sm text-slate-700 hover:text-brand-700"
  >
    <Icon name={icon} />
    {label}
  </Link>
);

export const ProfileMenu = () => {
  const { user, clearSession } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isSeeker = user?.role === "JOB_SEEKER";

  const { data: profile } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: profilesApi.getJobSeekerProfile,
    enabled: isSeeker,
  });
  const { data: applications } = useQuery({
    queryKey: ["applications", "mine"],
    queryFn: applicationsApi.listMine,
    enabled: isSeeker,
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!user) return null;

  const close = () => setOpen(false);
  const name = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : user.email.split("@")[0];
  const initial = name.charAt(0).toUpperCase();
  const percent = profile?.completionPercentage ?? 0;
  const shortlisted =
    applications?.filter((a) =>
      ["SHORTLISTED", "INTERVIEW", "OFFERED"].includes(a.status),
    ).length ?? 0;
  const home =
    user.role === "RECRUITER"
      ? "/recruiter/jobs"
      : user.role === "ADMIN"
        ? "/admin/users"
        : "/profile";

  const avatar = profile?.photoUrl ? (
    <img src={profile.photoUrl} alt="" className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-brand-50 text-2xl font-bold text-brand-700">
      {initial}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open profile menu"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-50 text-sm font-bold text-brand-700 ring-2 ring-brand-100 hover:ring-brand-300"
      >
        {profile?.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-slate-900/40" onClick={close} />
            <aside className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl">
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 text-2xl leading-none text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

              <div className="mt-6 flex items-center gap-5">
                {isSeeker ? (
                  <Ring percent={percent}>{avatar}</Ring>
                ) : (
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full">
                    {avatar}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-xl font-bold text-slate-900">
                    {name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {isSeeker
                      ? (profile?.headline ?? "Add a headline to stand out")
                      : user.role.toLowerCase()}
                  </p>
                  <Link
                    to={home}
                    onClick={close}
                    className="mt-2 inline-block text-sm font-medium text-brand-600 hover:underline"
                  >
                    {isSeeker ? "View & Update Profile" : "Go to dashboard"}
                  </Link>
                </div>
              </div>

              {isSeeker && (
                <>
                  <hr className="my-6 border-slate-200" />
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-semibold text-slate-900">
                      Your profile performance
                    </h2>
                    <span className="text-xs text-slate-400">All time</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 divide-x divide-slate-200 rounded-xl bg-brand-50/60 py-5 text-center">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {applications?.length ?? 0}
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        Applications
                      </p>
                      <Link
                        to="/applications"
                        onClick={close}
                        className="text-xs font-medium text-brand-600 hover:underline"
                      >
                        View all
                      </Link>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {shortlisted}
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        Recruiter Actions
                      </p>
                      <Link
                        to="/applications"
                        onClick={close}
                        className="text-xs font-medium text-brand-600 hover:underline"
                      >
                        View all
                      </Link>
                    </div>
                  </div>
                </>
              )}

              <nav className="mt-4 divide-y divide-slate-100">
                {isSeeker && (
                  <>
                    <MenuLink
                      to="/saved-jobs"
                      label="Saved jobs"
                      icon="bookmark"
                      onClick={close}
                    />
                    <MenuLink
                      to="/job-alerts"
                      label="Job alerts"
                      icon="bell"
                      onClick={close}
                    />
                  </>
                )}
                <MenuLink
                  to="/contests"
                  label="Skill contests"
                  icon="trophy"
                  onClick={close}
                />
                <MenuLink
                  to="/career-guidance"
                  label="Career guidance"
                  icon="guide"
                  onClick={close}
                />
                {isSeeker && (
                  <MenuLink
                    to="/profile"
                    label="Settings"
                    icon="settings"
                    onClick={close}
                  />
                )}
                <MenuLink to="/faqs" label="FAQs" icon="help" onClick={close} />
                <button
                  onClick={() => {
                    clearSession();
                    close();
                    navigate("/");
                  }}
                  className="flex w-full items-center gap-4 py-3.5 text-left text-sm text-slate-700 hover:text-red-600"
                >
                  <Icon name="logout" />
                  Logout
                </button>
              </nav>
            </aside>
          </div>,
          document.body,
        )}
    </>
  );
};
