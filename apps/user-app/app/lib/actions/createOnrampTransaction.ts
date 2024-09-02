"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";


export async function createOnRampTransaction(amount:number, provider:string) {
    const session = await getServerSession(authOptions);
    const token = Math.random().toString(); //this is when you goes to bank and the bank knows someone came to me I should return a token before we send to the netbanking
    const userId = session.user.id;

    if(!userId){
        return {
            message: "User are not logged in"
        }
    }
    //user logged in create a entry 
    await prisma.onRampTransaction.create({
        data: {
            userId: Number(userId),
            amount:amount,
            status:"Processing",
            startTime: new Date(),
            provider,
            token:token
        }
    })
    return {
        message: "onRampTransaction added"
    }
}