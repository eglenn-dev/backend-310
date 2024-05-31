"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./card.module.css";

interface PrintRequestProps {
    color: string;
    comment: string;
    confirmationCode: string;
    date: string;
    email: string;
    fileURL: string;
    infill: string;
    name: string;
    quality: string;
    status: string;
    time: string;
    weight: string;
}

const PrintRequestCard: React.FC<PrintRequestProps> = ({
    color,
    comment,
    confirmationCode,
    date,
    email,
    fileURL,
    infill,
    name,
    quality,
    status,
    time,
    weight,
}) => {
    const [options, setOptions] = useState({
        colorOptions: [],
        qualityOptions: [],
        statusOptions: [],
    });
    useEffect(() => {
        const fetchStaticData = async () => {
            const response = await fetch("/api/static");
            const data = await response.json();
            setOptions(data);
        };

        fetchStaticData();
    }, []);

    const [showPopup, setShowPopup] = useState(false);
    const [newQuality, setQuality] = useState(quality);
    const [newStatus, setStatus] = useState(status);
    const [newColor, setColor] = useState(color);
    const [newInfill, setInfill] = useState(infill);
    const [newComment, setComment] = useState(comment);
    const [newTime, setTime] = useState(time);
    const [newWeight, setWeight] = useState(weight);
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    date = new Date(date).toLocaleDateString();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userToken = localStorage.getItem("userToken");
        const newData = {
            userToken: userToken,
            name: name,
            email: email,
            date: date,
            confirmationCode: confirmationCode,
            fileURL: fileURL,
            status: newStatus,
            color: newColor,
            quality: newQuality,
            infill: newInfill,
            comment: newComment,
            time: newTime,
            weight: newWeight,
        };
        const response = await fetch("/api/auth/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData),
        });
        setShowPopup(false);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowPopup(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className={styles.card}>
            <div
                className={styles.cardContent}
                onClick={() => setShowPopup(true)}
            >
                <h3>{name}</h3>
                <p className={styles.shortDetails}>
                    <Image
                        className={styles.shortIcon}
                        src="/clock.svg"
                        alt="Time"
                        width={20}
                        height={20}
                    />{" "}
                    {time}
                </p>
                <p className={styles.shortDetails}>
                    <Image
                        className={styles.shortIcon}
                        src="/weight.svg"
                        alt="Weight"
                        width={20}
                        height={20}
                    />{" "}
                    {weight}g
                </p>
                <p className={styles.shortDetails}>
                    <Image
                        className={styles.shortIcon}
                        src="/color.svg"
                        alt="Color"
                        width={20}
                        height={20}
                    />{" "}
                    {color}
                </p>
            </div>
            {showPopup && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <div className={styles.popupHeader}>
                            <h2>Print Request Details</h2>
                            <Image
                                className={styles.closeButton}
                                onClick={handleClosePopup}
                                src="/exit.svg"
                                alt="Close"
                                width={24}
                                height={24}
                            />
                        </div>
                        <div className={styles.popupInfoGrid}>
                            <div>
                                <h4>Static Information</h4>
                                <div>
                                    <p>Name: {name}</p>
                                </div>
                                <div>
                                    <p>Email: {email}</p>
                                </div>
                                <div>
                                    <p>Date Submitted: {date}</p>
                                </div>
                                <div>
                                    <p>Confirmation Code: {confirmationCode}</p>
                                </div>
                                <div className={styles.fileDownloadButton}>
                                    <a href={fileURL} download>
                                        Download File
                                    </a>
                                </div>
                            </div>
                            <form
                                className={styles.editForm}
                                onSubmit={handleSubmit}
                            >
                                <h4>Editable Information</h4>
                                <div>
                                    <label htmlFor="status">
                                        Status:
                                        <select
                                            id="status"
                                            name="status"
                                            value={newStatus}
                                            onChange={(e) =>
                                                setStatus(e.target.value)
                                            }
                                        >
                                            {options.statusOptions.map(
                                                (option: string) => (
                                                    <option
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="color">
                                        Color:
                                        <select
                                            id="color"
                                            name="color"
                                            value={newColor}
                                            onChange={(e) =>
                                                setColor(e.target.value)
                                            }
                                        >
                                            {options.colorOptions.map(
                                                (option: string) => (
                                                    <option
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="quality">
                                        Quality:
                                        <select
                                            name="quality"
                                            id="quality"
                                            value={newQuality}
                                            onChange={(e) =>
                                                setQuality(e.target.value)
                                            }
                                        >
                                            {options.qualityOptions.map(
                                                (option: string) => (
                                                    <option
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="infill">
                                        Infill:
                                        <input
                                            type="text"
                                            value={newInfill}
                                            onChange={(e) =>
                                                setInfill(e.target.value)
                                            }
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="comment">
                                        Comment/Notes:
                                        <textarea
                                            className={styles.commentBox}
                                            id="comment"
                                            value={newComment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="time">
                                        Time:
                                        <input
                                            type="text"
                                            value={newTime}
                                            placeholder="1h22m"
                                            onChange={(e) =>
                                                setTime(e.target.value)
                                            }
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="weight">
                                        Weight:
                                        <input
                                            type="text"
                                            placeholder="10"
                                            value={newWeight}
                                            onChange={(e) =>
                                                setWeight(e.target.value)
                                            }
                                        />
                                    </label>
                                </div>
                                <div>
                                    <button
                                        className={styles.saveButton}
                                        type="submit"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrintRequestCard;
