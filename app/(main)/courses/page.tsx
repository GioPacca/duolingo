import { getCourses, getUserProgress } from "@/db/queries";

import { List } from "./list";

const CoursesPage = async () => {
    const coursesData = getCourses(); /* Lista los cursos */
    const userProgressData = getUserProgress(); /* Revisa si está seleccionado algún país */

    const [
        courses,
        userProgress
    ] = await Promise.all([
        coursesData,
        userProgressData,
    ])

    return (
        <div className="h-4 max-w-[912px] px-3 mx-auto">
            <h1 className="text-2xl font-bold text-neutral-700">
                Language Courses
            </h1>
            <List
                /* Se llama a List, en donde está la
                 estructura de la impresión de cursos */
                courses={courses}
                activeCourseId={userProgress?.activeCourseId}
            />
        </div>
    );
};


export default CoursesPage;