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
    const tokenInput = await request.text();
    const userToken = tokenInput.slice(1, -1);
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
        let requestData = null;

        try {
            const snapshot = await db.ref().once("value");
            requestData = snapshot.val();
        } catch (error) {
            console.error("Error reading data:", error);
            return new Response(
                JSON.stringify({
                    status: "Error making request to database",
                }),
                { status: 500 }
            );
        }

        let returnData: { [key: string]: any } = {};

        if (requestData) {
            for (let key in requestData.printRequests) {
                returnData[key] = {
                    confirmationCode:
                        requestData.printRequests[key].confirmationCode,
                    name: requestData.printRequests[key].name,
                    email: requestData.printRequests[key].email,
                    infill: requestData.printRequests[key].infill,
                    quality: requestData.printRequests[key].quality,
                    color: requestData.printRequests[key].color,
                    comment: requestData.printRequests[key].comment,
                    status: requestData.printRequests[key].status,
                    date: requestData.printRequests[key].date,
                    fileURL: requestData.printRequests[key].fileURL,
                    time: requestData.printRequests[key].time,
                    weight: requestData.printRequests[key].weight,
                };
            }
        }

        return new Response(
            JSON.stringify({
                status: "Success",
                data: returnData,
            }),
            { status: 200 }
        );
    } else {
        return new Response(
            JSON.stringify({
                status: "Invalid token",
            }),
            { status: 401 }
        );
    }
}
