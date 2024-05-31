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
const storage = admin.storage();
const bucket = storage.bucket("maclab-backend.appspot.com");

function generateConfirmationNumber(name: string): string {
    const firstLetter = name.charAt(0);
    const timestamp = Date.now();
    return `${firstLetter}-${timestamp}`;
}

export async function GET(request: Request) {
    return new Response("Hello, world!");
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const data: { [key: string]: string } = {};
    // @ts-ignore
    for (const [key, value] of formData.entries()) {
        if (key != "file") {
            data[key] = value;
        }
    }
    const confirmationCode = generateConfirmationNumber(data.name);
    const file: File | null = formData.get("file") as unknown as File;
    let fileURL = "";

    if (file) {
        try {
            const newFileName = `${confirmationCode}-${file.name}`;
            const fileRef = bucket.file(newFileName);
            const uploadResponse = await fileRef.save(file.stream(), {
                metadata: {
                    contentType: file.type,
                },
            });

            await fileRef.makePublic();

            fileURL = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
        } catch (error) {
            console.error("Error uploading file:", error);
            return new Response("Error uploading file", { status: 500 });
        }
    }

    console.log("Received form data", data);
    const newEntry = db.ref("printRequests/").push();
    const currentDate = new Date().toISOString();
    newEntry.set({
        confirmationCode: confirmationCode,
        name: data.name,
        email: data.email,
        infill: data.infill,
        quality: data.quality,
        color: data.color,
        comment: data.comment,
        status: "Received",
        date: currentDate,
        time: data.time,
        weight: data.weight,
        fileURL: fileURL,
    });
    return new Response(
        JSON.stringify({
            status: "Success",
            confirmationCode: confirmationCode,
        }),
        { status: 200 }
    );
}
