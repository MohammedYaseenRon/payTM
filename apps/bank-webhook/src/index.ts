import express from "express";
import db from '@repo/db/client'


const app = express();

app.post("/hdfcWebHook", async (req,res) => {
    //Add zod validation here
    const paymentInformation = {
        token: String,
        userId: String,
        amount: String
    }={

        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount 
    };

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data :{
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }

            }),

            db.onRampTransaction.updateMany({
               
                where: {
                    token: paymentInformation.token
               },
               data: {
                    status : "Success"
               }
            })
        ]);

        res.json({
            message: "Captured"
        })

    }catch(e) {
        console.log(e);
        res.status(411).json({
            message:"Error while processing webhoook"
        })


    }

    
})

app.listen(3003);