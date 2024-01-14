import { auth } from '@clerk/nextjs';
import db from '@/lib/db';
import { MAX_FREE_COUNTS } from '@/constants';

export const increaseApiLimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const userApiLimit = await db.userAPILimit.findUnique({
        where: {
            userId
        }
    });

    if (userApiLimit) {
        await db.userAPILimit.update({
            where: {
                userId: userId,
            },
            data: {
                count: userApiLimit.count + 1 // Increment the count correctly
            }
        });
    } else {
        await db.userAPILimit.create({
            data: { userId: userId, count: 1 }
        });
    }
};

export const checkApiLimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const userApiLimit = await db.userAPILimit.findUnique({
        where: { userId: userId }
    });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
        return true;
    } else {
        return false;
    }
};

export const getUserApiLimit = async ()=>{
    const { userId } = auth()

    if(!userId){
        return 0;
    }

    const userApiLimit = await db.userAPILimit.findUnique({
        where:{userId}
    });

    if(!userApiLimit){
        return 0;
    }


    return userApiLimit.count;
}
