"use client";
import Image from "next/image";
import styles from "./header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function HeaderNav() {
    const [home, setHome] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/") {
            setHome(true);
        } else {
            setHome(false);
        }
    }, [pathname]);

    return (
        <nav className={styles.navSpacing}>
            <div className={styles.logos}>
                <a href="https://www.byui.edu" target="_blank">
                    <Image
                        className={styles.byuiLogo}
                        src="/byui.svg"
                        alt="Logo"
                        width={75}
                        height={50}
                    />
                </a>
                <div className={styles.divider}></div>
                <div className={styles.headerText}>
                    <a href="https://library.byui.edu" target="_blank">
                        McKay Library
                    </a>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.headerText}>
                    <a href="https://library.byui.edu/maclab" target="_blank">
                        Mac Lab
                    </a>
                </div>
            </div>
            <div className={home ? styles.hide : ""}>
                <Link className={styles.homeButton} href="/">
                    Home
                </Link>
            </div>
        </nav>
    );
}
