"use client";
import { useState } from "react";
import PrintRequestForm from "../components/PrintRequestForm";
import styles from "./page.module.css";

export default function Request() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState("");

    const handleSubmit = async (
        confirmationCode: string,
        event: React.FormEvent<HTMLFormElement>
    ) => {
        setConfirmationCode(confirmationCode);
        event.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <>
            {isSubmitted ? (
                <div
                    className={`${styles.heroMessage} ${styles.submissionMessage}`}
                >
                    <h1 className={styles.heroH1}>
                        Thank you for your submission!
                    </h1>
                    <p className={styles.heroP}>
                        You can expect a reply from the Mac Lab with more
                        details and a price within 24 hours.
                    </p>
                    <p className={styles.heroP}>
                        Your confirmation code is{" "}
                        <span className={styles.confirmationCode}>
                            #{confirmationCode}.
                        </span>{" "}
                        Please keep this code for future reference.
                    </p>
                    <p className={styles.heroP}>
                        If you have any questions, please{" "}
                        <a
                            className={styles.link}
                            target="_blank"
                            href="https://library.byui.edu/maclab/pages/contactUs.html"
                        >
                            contact us
                        </a>
                        .
                    </p>
                    <button
                        className={styles.moreSubmitButton}
                        onClick={() => setIsSubmitted(false)}
                    >
                        Submit Another Print
                    </button>
                </div>
            ) : (
                <div>
                    <div className={styles.heroMessage}>
                        <h1 className={styles.heroH1}>3D Print Request</h1>
                        <p>We only accept STL, OBJ, or 3MF files.</p>
                    </div>
                    <div>
                        <PrintRequestForm onSubmit={handleSubmit} />
                    </div>
                </div>
            )}
        </>
    );
}
