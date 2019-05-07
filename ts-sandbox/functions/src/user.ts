import { Request, Response } from 'firebase-functions';
import { Firestore } from "@google-cloud/firestore";
import { User } from './dataTypes';
import { PROJECT_ID } from './constants';

function getDBClient(): Firestore {
    return new Firestore({
        projectId: PROJECT_ID,
    });
}

async function writeUserToDB(userData: User) {
    const db: Firestore = getDBClient();
    return await db.collection("users").doc(userData.userId).set(userData);
}

export async function addNewUser(req:Request, res: Response) {
    const data: any = req.body || {};
    const userData: User = {
        userId: data.userId,
        email: data.email
    }
    console.log(data)

    return await writeUserToDB(userData).then(() => {
        return res.status(201).json(userData);
    }).catch((err: Error) => {
        return res.status(500).send({
            error: `Error writing user info to database - ${err}`
        });
    });
} 

export async function getUser(userId: string, req: Request, res: Response) {
    const dbClient: Firestore = getDBClient();
    const userDoc = dbClient.collection('users').doc(userId);

    return await userDoc.get().then((snapshot) => {
        if (!snapshot.exists) {
            return res.status(404).send({
                message: `User ${userId} not found.`
            });
        }

        return res.json({
            userId: snapshot.get("userId"),
            email: snapshot.get("email"),
        });
      }).catch((err) => {
            console.error("Error fetching doc: %s", err)
            return res.status(500).send({
                error: `Error getting user model for ${userId} from database - ${err}`
            })
      });
}

async function deleteUserFromDB(userId: string, response: Response) {
    const db: Firestore = getDBClient();
    const userDoc = db.collection('users').doc(userId);

    return await userDoc.get().then(async (snapshot) => {
        if (!snapshot.exists) {
            return response.status(404).send({
                message: `User ${userId} not found in database`
            });
        }

        await userDoc.delete().then((updatedDoc) => {
            return response.json({
                message: `Deleted MFA information for user ${userId}`
            })
        }).catch((err) => {
            return response.status(500).send({
                error: `Internal error deleting MFA for user ${userId} - ${err}`
            })
        });
        return;
    })
}

export async function deleteUser(userId: string, request: Request, response: Response) {
    return await deleteUserFromDB(userId, response);
}

