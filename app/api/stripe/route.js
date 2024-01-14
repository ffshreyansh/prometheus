import {auth, currentUser} from '@clerk/nextjs';
import { NextResponse } from "next/server";
import db from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';

const settingsUrl = absoluteUrl('/settings');

export async function GET(){
    try {
        const {userId} =  auth();
        const user = await currentUser();

        if(!userId || !user){
            return new NextResponse('Unathorized Access', {status: 401});
        }

        const userSubs =  await db.UserSubscriptions.findUnique({
            where:{userId}
        });

        if(userSubs && userSubs.stripeCustomerId){
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubs.stripeCustomerId,
                return_url: settingsUrl
            });

            return new NextResponse(JSON.stringify({url: stripeSession.url}));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: 'USD',
                        product_data: {
                            name: 'Prometheus Pro',
                            description: 'Unlimited AI Generation'
                        },
                        unit_amount: 2200,
                        recurring: {
                            interval: 'month'
                        },
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId,
            }
        });

        return new NextResponse(JSON.stringify({url: stripeSession.url}))


    } catch (error) {
        console.log('Stripe Error', error);
        return new NextResponse('Internal error', {status: 500});
    }
}