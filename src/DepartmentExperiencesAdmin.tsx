import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Eye, Palette } from "lucide-react";
import { AdminTitle, Panel, Toggle } from "./Admin";
import { useStore } from "./store";
import { Button } from "./ui";
import {
  departments,
  categoryForDepartment,
  experienceForDepartment,
} from "./departments";
import type { DepartmentExperience } from "./data";

export default function DepartmentExperiencesAdmin() {
  const s = useStore();
  const [slug, setSlug] = useState("organic");
  const d = departments.find((d) => d.slug === slug)!;
  const [draft, setDraft] = useState<DepartmentExperience>(() =>
    experienceForDepartment(d, s.categories),
  );
  const [changed, setChanged] = useState(false);
  function select(next: string) {
    setSlug(next);
    setDraft(
      experienceForDepartment(
        departments.find((d) => d.slug === next)!,
        s.categories,
      ),
    );
    setChanged(false);
  }
  function set<K extends keyof DepartmentExperience>(
    key: K,
    value: DepartmentExperience[K],
  ) {
    setDraft((x) => ({ ...x, [key]: value }));
    setChanged(true);
  }
  return (
    <>
      <AdminTitle
        title="Four worlds. One familiar name."
        text="Shape the colour, imagery and story of each Nirbhor department."
      >
        <Button variant="outline" to={"/" + slug} target="_blank">
          <Eye size={15} />
          Preview saved page
        </Button>
        <Button
          onClick={() => {
            if (!draft.heroTitle.trim() || !draft.heroImage.trim()) {
              s.toast("Add a headline and hero image before saving.");
              return;
            }
            const c = categoryForDepartment(d, s.categories);
            if (!c) {
              s.toast("Create this department category first.");
              return;
            }
            s.setCategories((x) =>
              x.map((item) =>
                item.id === c.id
                  ? { ...item, departmentSlug: d.slug, experience: draft }
                  : item,
              ),
            );
            setChanged(false);
            s.toast(`${d.name} experience saved.`);
          }}
        >
          <Check size={15} />
          {changed ? "Save changes" : "Save experience"}
        </Button>
      </AdminTitle>
      <div className="experience-admin-tabs">
        {departments.map((item) => (
          <button
            key={item.slug}
            onClick={() => select(item.slug)}
            className={slug === item.slug ? "active" : ""}
          >
            <span
              style={{
                background: experienceForDepartment(item, s.categories).accent,
              }}
            />
            {item.name}
          </button>
        ))}
      </div>
      <div className="experience-admin-layout">
        <Panel
          title="A department with its own point of view."
          subtitle="These details appear on the landing page and carry through the collection."
        >
          <div className="form-stack">
            <label className="field">
              Hero headline
              <textarea
                value={draft.heroTitle}
                onChange={(e) => set("heroTitle", e.target.value)}
                rows={2}
              />
            </label>
            <label className="field">
              Introduction
              <textarea
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
              />
            </label>
            <label className="field">
              Hero image URL
              <input
                value={draft.heroImage}
                onChange={(e) => set("heroImage", e.target.value)}
              />
            </label>
            <label className="field">
              Announcement text
              <input
                value={draft.announcement}
                onChange={(e) => set("announcement", e.target.value)}
              />
            </label>
            <div className="experience-color-fields">
              {(
                [
                  ["accent", "Accent colour"],
                  ["background", "Background colour"],
                  ["ink", "Heading colour"],
                ] as const
              ).map(([key, label]) => (
                <label className="field" key={key}>
                  {label}
                  <div>
                    <input
                      type="color"
                      aria-label={label}
                      value={draft[key]}
                      onChange={(e) => set(key, e.target.value)}
                    />
                    <code>{draft[key]}</code>
                  </div>
                </label>
              ))}
            </div>
            <label className="field">
              Story headline
              <textarea
                value={draft.storyTitle}
                onChange={(e) => set("storyTitle", e.target.value)}
                rows={2}
              />
            </label>
            <label className="field">
              Story description
              <textarea
                value={draft.storyText}
                onChange={(e) => set("storyText", e.target.value)}
                rows={4}
              />
            </label>
            <Toggle
              checked={draft.enabled}
              onChange={(v) => set("enabled", v)}
              label="Department landing is enabled"
              description="Show this department in the main discovery cards and navigation."
            />
          </div>
        </Panel>
        <aside>
          <div
            className="experience-preview"
            style={{ background: draft.background, color: draft.ink }}
          >
            <span>
              NIRBHOR <i>{d.name}</i>
            </span>
            <img src={draft.heroImage} alt={`${d.name} draft preview`} />
            <div>
              <small>{d.kicker}</small>
              <h2>{draft.heroTitle}</h2>
              <p>{draft.description}</p>
              <span
                className="experience-preview-cta"
                style={{ background: draft.accent }}
              >
                Explore {d.name}
                <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
          <p className="experience-preview-note">
            Draft preview. Open the storefront after saving to see the complete
            experience.
          </p>
          <Panel title="One store, thoughtful continuity.">
            <p className="experience-admin-help">
              This palette also follows the department into its product listing
              and product pages. Your customers keep one bag, one account and
              one familiar checkout.
            </p>
            <Link className="text-link" to="/" target="_blank">
              Preview the main homepage <ArrowUpRight size={14} />
            </Link>
          </Panel>
        </aside>
      </div>
    </>
  );
}
