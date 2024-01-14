import { headers } from '@/next.config'
import { NextResponse } from 'next/server'
import Stripe from 'stripe' 
import db from '@/lib/db';
import { stripe } from '@/lib/stripe';


export async function POST(req){
    const body = await req.text();
    const signature = headers().get("Stripe-Signature");
    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        return new NextResponse(`Web Hook Error: ${error.message}`, {status: 400});
    }

    const session =  event.data.object;

    if(event.type ==='checkout.session.completed'){
        const subscription =  await stripe.subscriptions.retrieve(
            session.subscription
        );

        if(session?.metadata?.userId){
            return new NextResponse('User Id is required', {status: 400});
        }

        await db.userSubscriptions.create({
            data: {
                userId: session?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer.id,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            },
        })
    }

    if(event.type === 'invoice.payment_succeeded'){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription
        )

        await db.UserSubscriptions.update({
            where:{
                stripeSubscriptionId: subscription.id
            },
            data:{
                stripePriceId:subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            }
        })
    }

    return new NextResponse(null, {status: 200})
}
