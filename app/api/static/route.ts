export async function GET() {
    const admin = require("firebase-admin");
    const serviceAccount = require("../../../maclab-backend-firebase-adminsdk-zwz6q-1059ef3309.json");

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://maclab-backend-default-rtdb.firebaseio.com",
            storageBucket: "maclab-backend.appspot.com",
        });
    }

    const db = admin.database();
    let data = null;

    try {
        const snapshot = await db.ref("/staticData").once("value");
        data = snapshot.val();
    } catch (error) {
        console.error("Error reading data:", error);
        return new Response(
            JSON.stringify({
                status: "Error making request to database",
            }),
            { status: 500 }
        );
    }
    return new Response(JSON.stringify(data), { status: 200 });
}
