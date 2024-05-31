"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import Card from "./card";

const Admin = () => {
    const [userToken, setUserToken] = useState("");
    const router = useRouter();
    let data = null;
    let responseData = null;
    let [receivedRequests, setReceivedRequests] = useState<any[]>([]);
    let [waitingRequests, setWaitingRequests] = useState<any[]>([]);
    let [printingRequests, setPrintingRequests] = useState<any[]>([]);
    let [completedRequests, setCompletedRequests] = useState<any[]>([]);
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            setUserToken(token);
        }

        if (!token) {
            router.push("/login");
        }
    }, []);

    useEffect(() => {
        if (userToken) {
            const fetchData = async () => {
                const response = await fetch("/api/auth/data", {
                    method: "POST",
                    body: JSON.stringify(userToken),
                });
                if (response.status === 401) {
                    console.error("Token expired", response);
                    router.push("/login");
                } else if (!response.ok) {
                    console.error("Failed to fetch data", response);
                    router.push("/login");
                }
                responseData = await response.json();
                data = responseData.data;
                let newReceivedRequests: any[] = [];
                let newWaitingRequests: any[] = [];
                let newPrintingRequests: any[] = [];
                let newCompletedRequests: any[] = [];
                for (let key in data) {
                    if (data[key].status === "Received") {
                        newReceivedRequests.push(data[key]);
                    } else if (data[key].status === "Pending Print") {
                        newWaitingRequests.push(data[key]);
                    } else if (data[key].status === "Printing") {
                        newPrintingRequests.push(data[key]);
                    } else if (data[key].status === "Completed") {
                        newCompletedRequests.push(data[key]);
                    }
                }
                setReceivedRequests(newReceivedRequests);
                setWaitingRequests(newWaitingRequests);
                setPrintingRequests(newPrintingRequests);
                setCompletedRequests(newCompletedRequests);
            };
            fetchData();
            const intervalID = setInterval(fetchData, 10000);
            return () => clearInterval(intervalID);
        }
    }, [userToken]);
    return (
        <div className={styles.adminArea}>
            <h1>3D Print Requests</h1>
            <div className={styles.requestsArea}>
                <div className={styles.requestColumn}>
                    <h2>Received ({receivedRequests.length})</h2>
                    {receivedRequests.map((request) => (
                        <Card key={request.confirmationCode} {...request} />
                    ))}
                </div>
                <div className={styles.requestColumn}>
                    <h2>Pending Print ({waitingRequests.length})</h2>
                    {waitingRequests.map((request) => (
                        <Card key={request.confirmationCode} {...request} />
                    ))}
                </div>
                <div className={styles.requestColumn}>
                    <h2>Printing ({printingRequests.length})</h2>
                    {printingRequests.map((request) => (
                        <Card key={request.confirmationCode} {...request} />
                    ))}
                </div>
                <div className={styles.requestColumn}>
                    <h2>Completed ({printingRequests.length})</h2>
                    {completedRequests.map((request) => (
                        <Card key={request.confirmationCode} {...request} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;
