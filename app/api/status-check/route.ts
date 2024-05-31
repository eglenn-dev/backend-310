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

export async function POST(request: Request) {
    const confirmationCode = (await request.json()).confirmationCode;
    const ref = db.ref();
    let responseData = null;

    try {
        const snapshot = await db.ref().once("value");
        responseData = snapshot.val();
    } catch (error) {
        console.error("Error reading data:", error);
        return new Response(
            JSON.stringify({
                status: "Error making request to database",
            }),
            { status: 500 }
        );
    }

    const dataObj = responseData;
    const requests = dataObj.printRequests;

    for (let key in requests) {
        if (
            requests[key].confirmationCode.toLowerCase() ===
            confirmationCode.toLowerCase()
        ) {
            return new Response(
                JSON.stringify({
                    status: "Database Request Made",
                    printStatus: requests[key].status,
                }),
                { status: 200 }
            );
        }
    }
    return new Response(
        JSON.stringify({
            status: "No request found with that confirmation code",
        }),
        { status: 404 }
    );
}
