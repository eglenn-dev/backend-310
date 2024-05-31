import jwt from "jsonwebtoken";

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
    const { email, password } = await request.json();
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
    const users = dataObj.users;

    for (let key in users) {
        if (
            users[key].email.toLowerCase() === email.toLowerCase() &&
            users[key].password === password
        ) {
            const token = jwt.sign(
                { userId: users[key].uid },
                "exampleSecretKey123"
            );
            const newTokenEntry = db.ref("tokens/").push();
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 12);
            const expirationDateISOString = expirationDate.toISOString();
            newTokenEntry.set({
                token,
                expirationDateISOString,
            });
            console.log("Token saved to database.");
            return new Response(
                JSON.stringify({
                    status: "Success",
                    userToken: token,
                }),
                { status: 200 }
            );
        }
    }
    return new Response(
        JSON.stringify({
            status: "User found with that information.",
        }),
        { status: 404 }
    );
}
