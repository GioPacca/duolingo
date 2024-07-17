import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { courses, userProgress, units, challengeProgress, lessons, challenges, challengesEnum } from "@/db/schema";

export const getUserProgress = cache(async () => {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeCourse: true,
        },
    });
    return data;
});

export const getUnits = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();
    /* sino tengo u serID o el usuario no tiene progreso o no tenemos un curso activo */
    if (!userId || !userProgress?.activeCourseId) {
        return [];
    }
    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId)
                            },
                        }
                    },
                },
            },
        },
    });

    /* Para obtener datos individuales y chequear desde el frontend las lecciones completadas*/
    const normalizeData = data.map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            /* ESTO CAPAZ DESPUES SE PUEDE BORRAR */
            if (lesson.challenges.length === 0) {
                return { ...lesson, completed: false }
            }
            /* SERÍA BORRAR HASTA ACÁ */

            /* Por cada leccion verificará si las lecciones en ellas fueron completadas */
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengeProgress
                    && challenge.challengeProgress.length > 0
                    && challenge.challengeProgress.every((progress) => progress.completed);
            });
            return { ...lesson, completed: allCompletedChallenges }
        })
        return { ...unit, lessons: lessonsWithCompletedStatus }
    });
    return normalizeData;
});

export const getCourses = cache(async () => {
    /* Utilizamos "cache" de react para obtener "courses" sin tener
     que tengamos que sesguir todos los pasos de vuelta */
    const data = await db.query.courses.findMany();
    /* 
    con await llamamos a la base de datos e importamos "db" de drizzle para manejar la misma
    a si que entramos a courses y aplicamos el método "findMany()"
     */

    return data;
});

export const getCourseById = cache(async (courseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
    });

    return data;
});

export const getCourseProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    /* Chequeamos que si no hay progreso en el usuario devolvemos el valor "null" */
    if (!userId || !userProgress?.activeCourseId) {
        return null;
    }

    /* devuelve los cursos activos más todo lo que ello conlleva(lecciones, progreso, etc) */
    const unitsInActiveCourse = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            },
                        },
                    },
                },
            },
        },
    });

    /* El siguiente método encuentra la primera lección incompleta */
    const firstUncompletedLesson = unitsInActiveCourse.flatMap((unit) => unit.lessons).find((lesson) => {
        return lesson.challenges.some((challenge) => {
            return !challenge.challengeProgress
                /* Si no tenes progreso */
                || challenge.challengeProgress.length === 0
                /* O tenes progreso pero no está concluido  */
                || challenge.challengeProgress.some((progress) =>
                    progress.completed === false)
        });
    });

    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id
    };
});

export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const courseProgress = await getCourseProgress();

    const lessonId = id || courseProgress?.activeLessonId;

    if (!lessonId) {
        return null;
    }

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                    challengeOptions: true,
                    challengeProgress: {
                        where: eq(challengeProgress.userId, userId),
                    },
                },
            },
        },
    });

    if (!data || !data.challenges) {
        return null;
    }

    const normalizedChallenges = data.challenges.map((challenge) => {
        const completed = challenge.challengeProgress
            && challenge.challengeProgress.length > 0
            && challenge.challengeProgress.every((progress) => progress.completed)

        return { ...challenge, completed };
    });

    return { ...data, challenges: normalizedChallenges }

});

export const getLessonPorcentage = cache(async () => {
    const courseProgress = await getCourseProgress();

    if (!courseProgress?.activeLessonId) {
        return 0;
    }

    const lesson = await getLesson(courseProgress.activeLessonId);
    if (!lesson) {
        return 0;
    }

    const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);
    const porcentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100,
    );

    return porcentage;
})

export const getTopTenUsers = cache(async () => {
    const {userId} = await auth();

    if(!userId){
        return[];
    }

    const data = await db.query.userProgress.findMany({
        orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
        limit: 10,
        /* es equivalente al select */
        columns: {
            userId: true,
            userName: true,
            userImageSrc: true,
            points: true,
        }
    })
    return data;
})