"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Status() {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const confirmationCode = formData.get("confirmationCode");

        const response = await fetch("/api/status-check", {
            method: "POST",
            body: JSON.stringify({ confirmationCode }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        setLoading(false);
        setStatus(data.printStatus);
    };

    return (
        <div className={styles.statusArea}>
            <h1>Status</h1>
            <p>Check the status of your 3D print.</p>
            <form className={styles.statusForm} onSubmit={handleSubmit}>
                <label htmlFor="confirmationCode">
                    <input
                        className={styles.statusInput}
                        type="text"
                        id="confirmationCode"
                        name="confirmationCode"
                        placeholder="Confirmation Code"
                    />
                </label>

                <button
                    type="submit"
                    className={`${styles.submitButton} ${styles.cta}`}
                >
                    <span className={styles.ctaSpan}>
                        {loading ? "Loading..." : "Check Status"} &nbsp;
                    </span>
                    <svg
                        className={styles.ctaSvg}
                        viewBox="0 0 13 10"
                        height="10px"
                        width="15px"
                    >
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </button>
            </form>
            {status && (
                <div className={styles.statusResponse}>
                    <p>
                        <span className={styles.status}>Status:</span> {status}
                    </p>
                    <p>
                        Please{" "}
                        <a
                            className={styles.link}
                            href="https://library.byui.edu/maclab/pages/contactUs.html"
                            target="_blank"
                        >
                            contact
                        </a>{" "}
                        the Mac Lab for more details.
                    </p>
                </div>
            )}
        </div>
    );
}
