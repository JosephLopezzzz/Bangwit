import type { Dictionary } from "@/i18n/types";

type PolicyCopy = Pick<Dictionary["privacyPage"], "title" | "lastUpdated" | "sections">;

export function PolicyDocument({
  privacy,
  terms,
  className = "",
}: {
  privacy: PolicyCopy;
  terms: PolicyCopy;
  className?: string;
}) {
  const documents = [privacy, terms];

  return (
    <div className={`space-y-5 text-[14px] leading-relaxed text-muted ${className}`}>
      {documents.map((document) => (
        <section key={document.title}>
          <h2 className="ui-section-title">{document.title}</h2>
          <p className="mt-1 text-xs text-muted">{document.lastUpdated}</p>
          <div className="mt-3 space-y-4">
            {document.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="font-extrabold text-ink">{section.heading}</h3>
                <p className="mt-1">{section.content}</p>
              </section>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
