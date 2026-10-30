import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import Card from "@components/Card";
import slugify from "@utils/slugify";
import { rankSemanticResults } from "@utils/rankSemanticResults.js";
import type { BlogFrontmatter } from "@content/_schemas";

export type SearchItem = {
  title: string;
  description: string;
  data: BlogFrontmatter;
};

interface Props {
  searchList: SearchItem[];
  searchMode?: "keyword" | "semantic";
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

interface SemanticVectors {
  vectors: Array<{ id: string; embedding: number[] }>;
}

export default function SearchBar({
  searchList,
  searchMode = "keyword",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );
  const [semanticVectors, setSemanticVectors] =
    useState<SemanticVectors | null>(null);
  const [semanticError, setSemanticError] = useState(false);
  const [semanticLoading, setSemanticLoading] = useState(false);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = useMemo(
    () =>
      searchMode === "keyword"
        ? new Fuse(searchList, {
            keys: ["title", "description"],
            includeMatches: true,
            minMatchCharLength: 2,
            threshold: 0.5,
          })
        : null,
    [searchList, searchMode]
  );

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    setTimeout(function () {
      if (inputRef.current) {
        inputRef.current.selectionStart = inputRef.current.selectionEnd =
          searchStr?.length || 0;
      }
    }, 50);

    if (searchMode !== "semantic") return;
    let active = true;
    fetch("/search-vectors.json")
      .then(response => {
        if (!response.ok)
          throw new Error("Unable to load semantic search vectors.");
        return response.json() as Promise<SemanticVectors>;
      })
      .then(vectors => {
        if (active) setSemanticVectors(vectors);
      })
      .catch(() => {
        if (active) setSemanticError(true);
      });
    return () => {
      active = false;
    };
  }, [searchMode]);

  useEffect(() => {
    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      history.pushState(
        null,
        "",
        `${window.location.pathname}?${searchParams.toString()}`
      );
    } else {
      history.pushState(null, "", window.location.pathname);
    }

    if (inputVal.length <= 1) {
      setSearchResults([]);
      setSemanticLoading(false);
      return;
    }

    if (searchMode === "keyword") {
      setSearchResults(fuse?.search(inputVal) ?? []);
      return;
    }

    if (!semanticVectors) {
      setSemanticLoading(true);
      return;
    }

    const controller = new AbortController();
    setSemanticLoading(true);
    setSemanticError(false);
    const timeout = window.setTimeout(() => {
      fetch(`/api/embedding?q=${encodeURIComponent(inputVal)}`, {
        signal: controller.signal,
      })
        .then(response => {
          if (!response.ok) throw new Error("Semantic search request failed.");
          return response.json() as Promise<{ embedding: number[] }>;
        })
        .then(({ embedding }) => {
          const ranked = rankSemanticResults(
            embedding,
            semanticVectors.vectors,
            searchList.length
          );
          const itemsById = new Map(
            searchList.map(item => [slugify(item.data), item])
          );
          setSearchResults(
            ranked.flatMap(({ id }, refIndex) => {
              const item = itemsById.get(id);
              return item ? [{ item, refIndex }] : [];
            })
          );
          setSemanticLoading(false);
        })
        .catch(error => {
          if (error.name !== "AbortError") {
            setSemanticError(true);
            setSearchResults([]);
            setSemanticLoading(false);
          }
        });
    }, 200);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [inputVal, searchMode, semanticVectors]);
  const resultCount = searchResults?.length ?? 0;
  const loading =
    searchMode === "semantic" && (semanticLoading || !semanticVectors);
  return (
    <>
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
          </svg>
        </span>
        <input
          aria-label="Search articles"
          className="block w-full rounded border border-white/40 dark:border-slate-900/40 bg-white dark:bg-slate-900 py-3 pl-10 pr-3 placeholder:italic placeholder:text-opacity-75 focus:border-blue-600 dark:focus:border-orange-500 focus:outline-none"
          placeholder="Search for anything..."
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
          ref={inputRef}
        />
      </label>

      {inputVal.length > 1 && (
        <div className="mt-8" role="status" aria-live="polite">
          {semanticError
            ? "Semantic search is temporarily unavailable."
            : loading
              ? "Finding related posts..."
              : `Found ${resultCount}${resultCount === 1 ? " result" : " results"} for '${inputVal}'`}
        </div>
      )}

      <ul>
        {searchResults?.map(({ item, refIndex }) => (
          <Card
            href={`/posts/${slugify(item.data)}`}
            frontmatter={item.data}
            key={`${refIndex}-${slugify(item.data)}`}
          />
        ))}
      </ul>
    </>
  );
}
