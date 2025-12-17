import Datetime from "./Datetime";
import type { BlogFrontmatter } from "@content/_schemas";

export interface Props {
  href?: string;
  frontmatter: BlogFrontmatter;
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, description, tags } = frontmatter;
  return (
    <li className="content-card group">
      <a
        href={href}
        className="block focus-visible:outline-none"
      >
        {secHeading ? (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h2>
        ) : (
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
        )}
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-500 dark:text-gray-400">
          <Datetime datetime={pubDatetime} />
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          {description}
        </p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-medium bg-blue-50/50 dark:bg-slate-700/30 text-blue-700 dark:text-gray-300 rounded-full border border-blue-200/50 dark:border-slate-600/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline inline-flex items-center gap-1">
          Read more
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 inline-block transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </a>
    </li>
  );
}
