"use client";
import Image from "next/image";
import styles from "./footer.module.css";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Footer() {
    const [admin, setAdmin] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/admin") {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, [pathname]);
    return (
        <>
            <footer className={`${admin ? styles.hide : ""} ${styles.footer}`}>
                <div>
                    <a href="https://library.byui.edu/maclab" target="_blank">
                        <Image
                            className={styles.footerImage}
                            src="/footer.png"
                            width={156}
                            height={125}
                            alt="Mac Lab Logo"
                        />
                    </a>
                </div>
                <div className={styles.footerInfo}>
                    <div className={styles.footerInfoColumn}>
                        <h3>CONTACT US</h3>
                        <p>208-496-9550</p>
                        <p>mckaymaclab@byui.edu</p>
                        <p>McKay Library #140A</p>
                        <p>IG: @mckaylibrary</p>
                    </div>
                    <div className={styles.footerInfoColumn}>
                        <h3>SERVICES</h3>
                        <a href="https://library.byui.edu/maclab/pages/vr.html">
                            <p>Virtual Reality</p>
                        </a>
                        <a href="https://library.byui.edu/maclab/pages/3dPrinting.html">
                            <p>3D Printing</p>
                        </a>
                        <a href="https://library.byui.edu/maclab/pages/cricut.html">
                            <p>Cricut</p>
                        </a>
                        <a href="https://library.byui.edu/maclab/pages/equipment.html">
                            <p>Equipment Rental</p>
                        </a>
                        <a href="https://byui.libcal.com/calendar/events?cid=8606&t=d&d=0000-00-00&cal=8606&ct=36359&inc=0">
                            <p>Workshops</p>
                        </a>
                        <a href="https://library.byui.edu/maclab/pages/adobeHelp.html">
                            <p>Adobe Help</p>
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}
