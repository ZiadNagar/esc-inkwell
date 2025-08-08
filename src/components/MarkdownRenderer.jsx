export const MarkdownRenderer = ({ markdown }) => {
  if (!markdown) return null;

  const lines = markdown.split(/\n\n+/);
  return (
    <div className="space-y-4">
      {lines.map((block, idx) => {
        // images inline inside paragraph: ![alt](url)
        // handled later together with links

        // headings #, ##, ###
        const h1 = block.match(/^#\s+(.*)$/);
        if (h1)
          return (
            <h2 key={idx} className="text-2xl font-semibold">
              {h1[1]}
            </h2>
          );
        const h2 = block.match(/^##\s+(.*)$/);
        if (h2)
          return (
            <h3 key={idx} className="text-xl font-semibold">
              {h2[1]}
            </h3>
          );

        // code block ```
        if (block.startsWith("```")) {
          const content = block.replace(/```[a-zA-Z0-9]*\n?|```/g, "");
          return (
            <pre
              key={idx}
              className="overflow-x-auto rounded-lg border border-[--color-border] bg-black/40 p-4 text-sm"
            >
              <code>{content}</code>
            </pre>
          );
        }

        // inline images and links in the remaining paragraph
        const tokenRegex = /(!\[(.*?)\]\((.*?)\))|(\[(.*?)\]\((.*?)\))/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        while ((match = tokenRegex.exec(block)) !== null) {
          const [full] = match;
          const isImage = Boolean(match[1]);
          const textBefore = block.slice(lastIndex, match.index);
          if (textBefore) parts.push(textBefore);
          if (isImage) {
            const alt = match[2] || "image";
            const url = match[3] || "";
            parts.push(
              <img
                key={`img-${idx}-${match.index}`}
                src={url}
                alt={alt}
                loading="lazy"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="inline-block max-w-full rounded-lg border border-[--color-border] align-middle"
                onError={(e) => {
                  e.currentTarget.alt = `${alt} (failed to load)`;
                }}
              />
            );
          } else {
            const text = match[5] || "link";
            const href = match[6] || "#";
            parts.push(
              <a
                key={`a-${idx}-${match.index}`}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[--color-accent] underline"
              >
                {text}
              </a>
            );
          }
          lastIndex = match.index + full.length;
        }
        const remainder = block.slice(lastIndex);
        if (remainder) parts.push(remainder);
        return (
          <p key={idx} className="leading-7">
            {parts}
          </p>
        );
      })}
    </div>
  );
};
