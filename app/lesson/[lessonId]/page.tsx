import { redirect } from "next/navigation";

import { getLesson, getUserProgress } from "@/db/queries";

import { Quiz } from "../quiz";

import { challengeOptions, challenges } from "@/db/schema";

type Props = {
    params: {
        lessonId: number;
    }
}

const LessonIdPage = async ({
    params,
}: Props) => {
    const lessonData = getLesson(params.lessonId);
    const userProgressData = getUserProgress();

    const [
        lesson,
        userProgress
    ] = await Promise.all([
        lessonData,
        userProgressData
    ]);

    if (!lesson || !userProgress) {
        redirect("/learn");
    }

    const initialPorcentage = lesson.challenges.filter((challenge) =>
        challenge.completed).length / lesson.challenges.length * 100;

    return (
        <Quiz
            initialLessonId={lesson.id}
            initialLessonChallenges={lesson.challenges}
            initialHearts={userProgress.hearts}
            initialPorcentage={initialPorcentage}
            userSubscription={null}
        />
    )
}

export default LessonIdPage;