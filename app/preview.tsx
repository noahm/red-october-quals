"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { ReactNode } from "react";

export function PreviewForm(props: { children: ReactNode }) {
  const router = useRouter();

  return (
    <form
      action="/"
      method="GET"
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const preview = e.currentTarget.querySelector("input")!.value || "";
        if (preview) {
          router.push("/?preview=" + encodeURIComponent(preview));
        } else {
          router.push("/");
        }
      }}
    >
      {props.children}
    </form>
  );
}
