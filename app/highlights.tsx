"use client";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import styles from "./page.module.css";
import { cn } from "./utils";

interface ContextValue {
  highlight: string | undefined;
  setHighlight: (next: string | undefined) => void;
}

const highlightContext = createContext<ContextValue>({
  highlight: undefined,
  setHighlight() {},
});
highlightContext.displayName = "HighlightContext";

export function useHighlightContext() {
  return useContext(highlightContext);
}

export function HighlightContextProvider(props: { children: ReactNode }) {
  const [highlight, setHighlight] = useState<string>();
  const value = useMemo<ContextValue>(
    () => ({
      highlight,
      setHighlight,
    }),
    [highlight],
  );
  return (
    <highlightContext.Provider value={value}>
      {props.children}
    </highlightContext.Provider>
  );
}

export function TableRow(
  props: PropsWithChildren<{ name: string; isPreview?: boolean }>,
) {
  const { highlight, setHighlight } = useHighlightContext();
  return (
    <tr
      onClick={() => setHighlight(props.name)}
      className={cn({
        [styles.rowHighlight]: highlight === props.name,
        [styles.previewRow]: props.isPreview,
      })}
    >
      {props.children}
    </tr>
  );
}
