"use client";
import styles from "./PrintRequestForm.module.css";
import React, { useState } from "react";
import Link from "next/link";

const options = {
    quality: [
        "0.20 SPEED",
        "0.20 STRUCTURAL",
        "0.15 SPEED",
        "0.15 STRUCTURAL",
        "0.10 SPEED DETAIL",
    ],
    colors: [
        "Black PLA",
        "White PLA",
        "Red PLA",
        "Blue PLA",
        "Green PLA",
        "Yellow PLA",
        "Orange PLA",
        "Purple PLA",
        "Pink PLA",
        "Gray PLA",
        "Brown PETG",
        "Specialty PLA",
    ],
};

interface FormData {
    name: string;
    email: string;
    infill: string;
    quality: string;
    color: string;
    comment: string;
    agreement: boolean;
    time: string;
    weight: string;
    file: File | null;
}

interface PrintRequestFormProps {
    onSubmit: (
        confirmationCode: string,
        event: React.FormEvent<HTMLFormElement>
    ) => Promise<void>;
}

const PrintRequestForm: React.FC<PrintRequestFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        infill: "15%",
        quality: options.quality[0],
        color: "",
        comment: "",
        agreement: false,
        time: "",
        weight: "",
        file: null,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, type, value } = event.target as HTMLInputElement;
        const val =
            type === "checkbox"
                ? (event.target as HTMLInputElement).checked
                : value;
        setFormData({ ...formData, [name]: val });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFormData({ ...formData, file });
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        console.log("Submitting form", formData);
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            const value = formData[key as keyof FormData];
            if (value !== null) {
                if (typeof value === "boolean") {
                    data.append(key, value.toString());
                } else {
                    data.append(key, value);
                }
            }
        });

        const response = await fetch("/api/submit", {
            method: "POST",
            body: data,
        });

        if (!response.ok) {
            console.error("Failed to submit form", response);
        } else {
            const responseBody = await response.json();
            console.log("Form submitted successfully");
            onSubmit(responseBody.confirmationCode, event);
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (!value.endsWith("%")) {
            event.target.value = `${value}%`;
        }
    };

    return (
        <form className={styles.printForm} onSubmit={handleSubmit}>
            <div>
                <label className={styles.formLabelArea} htmlFor="name">
                    Name:
                    <input
                        className={styles.formInput}
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Joseph Smith"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div>
                <label className={styles.formLabelArea} htmlFor="email">
                    Email:
                    <input
                        className={styles.formInput}
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="smi18301@byui.edu"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div>
                <label className={styles.formLabelArea} htmlFor="infill">
                    Infill:
                    <input
                        className={styles.formInput}
                        type="text"
                        id="infill"
                        name="infill"
                        required
                        placeholder="20%"
                        value={formData.infill}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </label>
            </div>
            <div>
                <label className={styles.formLabelArea} htmlFor="quality">
                    Quality:
                    <select
                        className={styles.formInput}
                        id="quality"
                        name="quality"
                        required
                        value={formData.quality}
                        onChange={handleChange}
                    >
                        {options.quality.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label className={styles.formLabelArea} htmlFor="color">
                    Color:
                    <select
                        className={styles.formInput}
                        id="color"
                        name="color"
                        required
                        value={formData.color}
                        onChange={handleChange}
                    >
                        <option value="">Select a color</option>
                        {options.colors.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label className={styles.formCommentArea} htmlFor="comment">
                    Comment:
                    <textarea
                        className={`${styles.formInput} ${styles.commentArea}`}
                        id="comment"
                        name="comment"
                        placeholder="Special instructions or comments. If none, leave blank."
                        value={formData.comment}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div>
                <label className={styles.formLabelArea} htmlFor="file">
                    File:
                    <input
                        className={styles.formInput}
                        type="file"
                        id="file"
                        name="file"
                        required
                        accept=".stl,.obj,.3mf"
                        onChange={handleFileChange}
                    />
                </label>
            </div>
            <div>
                <label className={styles.termsArea} htmlFor="agreement">
                    <input
                        type="checkbox"
                        id="agreement"
                        name="agreement"
                        required
                        className={styles.formCheckbox}
                        checked={formData.agreement}
                        onChange={handleChange}
                    />
                    <p>
                        I agree to the{" "}
                        <Link className={styles.link} href="/policies">
                            terms and conditions
                        </Link>
                        .
                    </p>
                </label>
            </div>
            <button
                type="submit"
                className={`${styles.submitButton} ${styles.cta}`}
            >
                <span className={styles.ctaSpan}>
                    {loading ? "Loading..." : "Submit Request"} &nbsp;
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
    );
};

export default PrintRequestForm;
