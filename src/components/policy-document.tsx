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
    <div className={`space-y-6 text-sm leading-6 text-muted ${className}`}>
      {documents.map((document) => (
        <section key={document.title}>
          <h2 className="text-lg font-extrabold text-ink">{document.title}</h2>
          <p className="mt-1 text-xs text-muted">{document.lastUpdated}</p>
          <div className="mt-4 space-y-5">
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
