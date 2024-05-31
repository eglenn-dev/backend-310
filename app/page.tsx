import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className={styles.homeScreen}>
                <h1>3D Print Request System</h1>
                <div className={styles.buttonGrid}>
                    <Link href="/request">
                        <div className={styles.card}>
                            <div className={styles.icon}>
                                <Image
                                    className={styles.iconSVG}
                                    src="/upload.svg"
                                    alt="Upload icon"
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <p className={styles.title}>Upload</p>
                            <p className={styles.text}>
                                Submit a print request.
                            </p>
                        </div>
                    </Link>
                    <Link href="/status">
                        <div className={styles.card}>
                            <div className={styles.icon}>
                                <Image
                                    className={styles.iconSVG}
                                    src="/hashtag.svg"
                                    alt="Status icon"
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <p className={styles.title}>Status</p>
                            <p className={styles.text}>
                                Check the status of your 3D print.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}
