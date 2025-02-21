"use client";

import { RULE_ENGINE_URL } from "@/common/endpoint";
import styles from "./styles.module.css";

export default function RuleEnginePage() {
  return (
    <div className={styles.container}>
      <iframe
        src={`${RULE_ENGINE_URL}/rules`}
        className={styles.iframe}
        title="Rule Engine"
        allow="fullscreen"
      />
    </div>
  );
}
