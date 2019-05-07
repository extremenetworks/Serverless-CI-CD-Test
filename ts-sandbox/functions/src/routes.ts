import { Router } from "express";
import { Request, Response } from 'firebase-functions';
import { addNewUser, getUser, deleteUser } from './user';
const router = Router();

router.get("/user/:userId", async (req: Request, res: Response, next: Function) => {
    try {
        const id: string = req.params.userId;
        if (!id) {
            throw new Error('id is blank');
        }
        return await getUser(id, req, res);
    } catch(e) {
        next(e);
    }
    return;
});

router.post("/user", async (req: Request, res: Response, next: Function) => {
    try {
        return await addNewUser(req, res);
    } catch(e) {
        next(e);
    }
    return;
});

router.delete("/user/:userId", async (req: Request, res: Response, next: Function) => {
    try {
        const id: string = req.params.userId;
        if (!id) {
            throw new Error('id is blank');
        }
        return await deleteUser(id, req, res);
    } catch(e) {
        next(e);
    }
    return;
});

export default router;
