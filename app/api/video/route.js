import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import Replicate from "replicate";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limits";


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
})

export async function POST(req) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const freetrial = await checkApiLimit();

        if(!freetrial){
            return new NextResponse('Free trial expired',{status: 403});
        }


        const response = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
              input: {
                prompt_a: prompt
              }
            }
          );

          await increaseApiLimit();

        return NextResponse.json(response);
    } catch (error) {   
        console.log('[VIDEO_ERROR]', error.response?.data || error.message);
        return new NextResponse("Internal Error", { status: 500 });
    }
};