import { redirect } from "next/navigation";

import { getCourseProgress, getLessonPorcentage, getUnits, getUserProgress } from "@/db/queries";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";

import { Unit } from "./unit";
import { Header } from "./header";

const LearnPage = async () => {
    /* <A> */
    const userProgressData = getUserProgress();
    const courseProgressData = getCourseProgress();
    const lessonPorcentageData = getLessonPorcentage(); 
    const unitsData = getUnits();

    const [
        userProgress,
        units,
        courseProgress,
        lessonPorcentage,
    ] = await Promise.all([
        userProgressData,
        unitsData,
        courseProgressData,
        lessonPorcentageData,
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    if (!courseProgress){
        redirect("/courses")
    }

    /* <A/> */

    /*
    Lo que hace el bloque A es ejecutar un query que realiza una consulta
    en la base de datos preguntando si tiene algún progreso el usuario,
    si no tiene ninguno es redirigido a la dirección "/courses" para
    que elija uno
     */
    return (
        <div>
            <div className="flex flex-row-reverse gap-[48px] px-6 ">
                <StickyWrapper>
                    <UserProgress
                        activeCourse={userProgress.activeCourse}
                        hearts={userProgress.hearts}
                        points={userProgress.points}
                        hasActiveSubscription={false}
                    />
                </StickyWrapper>
                <FeedWrapper>
                    <Header title={userProgress.activeCourse.title} />
                    {units.map((unit) => (
                        <div key={unit.id} className="mb-10">
                            <Unit
                            id={unit.id}
                            order={unit.order}
                            description={unit.description}
                            title={unit.title}
                            lessons={unit.lessons}
                            /* Este "courseProgress" es el método que nos trae de la base de datos la información del curso, sus lecciones y el progreso de las mismas */
                            activeLesson={courseProgress.activeLesson}
                            activeLessonPorcentage={lessonPorcentage}
                            />
                        </div>
                    ))}
                </FeedWrapper>
            </div>
        </div>
    );
}

export default LearnPage;