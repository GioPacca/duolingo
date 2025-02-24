"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";

const POINTS_TO_REFILL = 10;

export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Unauthorized");
    }

    const course = await getCourseById(courseId);

    if (!course) {
        throw new Error("Course not found");
    }

    /*     if (!course.units.length || !course.units[0].lessons.length) {
            throw new Error("Course is empty");
        } */

    const existingUserProgress = await getUserProgress();

    /* <B> */
    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/mascot"
        })

        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }
    /* </B>  */
    /* 
    En el bloque de código B se procesa si el user tiene algun
    tipo de progreso en algun curso. Si no lo creara un nuevo
    proceso de un usuario en particular.
    */

    await db.insert(userProgress).values({
        userId, activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
    })
    /* 
    Todos los querys los estamos almacenando en el cache
    por lo que tenemos que actualizarlo para siempre tener la 
    información actualizada, para ello utilizamos el método 
    "revalidatePath".
     */
    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
}

/* Reducción de corazones */
export const reduceHearts = async (challengeId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("No autorizado");
    }

    const currentUserProgress = await getUserProgress();

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    });

    if(!challenge) {
        throw new Error("Challenge not found")
    }

    const lessonId = challenge.lessonId;

    const existingChallengeProgres = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    });

    const isPractice = !!existingChallengeProgres;

    if (isPractice) {
        return { error: "Practice" }
    }

    if (!currentUserProgress) {
        throw new Error("User progres not found")
    }

    if (currentUserProgress.hearts === 0) {
        return { error: "hearts" }
    }

    await db.update(userProgress).set({
        hearts: Math.max(currentUserProgress.hearts - 1, 0),
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
};

export const refillHearts = async() => {
    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if (currentUserProgress.hearts === 5){
        throw new Error("Tenes los corazones completos!")
    }

    if(currentUserProgress.points < POINTS_TO_REFILL){
        throw new Error("Puntos insuficientes")
    }

    await db.update(userProgress).set({
        hearts: 5,
        points: currentUserProgress.points - POINTS_TO_REFILL
    }).where(eq(userProgress.userId, currentUserProgress.userId));

    revalidatePath("/shop")
    revalidatePath("/learn")
    revalidatePath("/quests")
    revalidatePath("/leaderboard")
}