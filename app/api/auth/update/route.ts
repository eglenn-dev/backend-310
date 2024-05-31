const admin = require("firebase-admin");
const serviceAccount = require("../../../../maclab-backend-firebase-adminsdk-zwz6q-1059ef3309.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://maclab-backend-default-rtdb.firebaseio.com",
        storageBucket: "maclab-backend.appspot.com",
    });
}

const db = admin.database();

export async function POST(request: Request) {
    const newData = await request.json();
    const userToken = newData.userToken;
    let tokenGood = false;

    try {
        const snapshot = await db.ref("tokens/").once("value");
        const tokens = snapshot.val();
        for (let key in tokens) {
            if (tokens[key].token === userToken) {
                const expirationDateUTC = new Date(
                    tokens[key].expirationDateISOString
                );
                const expirationDateMST = new Date(
                    expirationDateUTC.getTime() - 7 * 60 * 60 * 1000
                );
                if (expirationDateMST < new Date()) {
                    return new Response(
                        JSON.stringify({
                            status: "Token expired",
                        }),
                        { status: 401 }
                    );
                } else {
                    tokenGood = true;
                }
            }
        }
    } catch (error) {
        console.error("Error reading data:", error);
        return new Response(
            JSON.stringify({
                status: "Error making request to database",
            }),
            { status: 500 }
        );
    }

    if (tokenGood) {
        const snapshot = await db.ref("printRequests/").once("value");
        const data = snapshot.val();
        for (let key in data) {
            if (data[key].confirmationCode === newData.confirmationCode) {
                db.ref("printRequests/" + key).update({
                    status: newData.status,
                    color: newData.color,
                    quality: newData.quality,
                    infill: newData.infill,
                    comment: newData.comment,
                    time: newData.time,
                    weight: newData.weight,
                });
            }
        }
        return new Response(JSON.stringify({ status: "Success" }), {
            status: 200,
        });
    }

    return new Response(JSON.stringify({ status: "Unauthorized" }), {
        status: 401,
    });
}
