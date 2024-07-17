"use client"

import { Admin, AdminContext, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

import { CourseList } from "./course/list";
import { CourseCreate } from "./course/create";
import { CourseEdit } from "./course/edit";

import { UnitList } from "./unit/list";
import { UnitCreate } from "./unit/create";
import { UnitEdit } from "./unit/edit";

import { LessonList } from "./lesson/list";
import { LessonCreate } from "./lesson/create";
import { LessonEdit } from "./lesson/edit";

import { ChallengeEdit } from "./challenge/edit";
import { ChallengeCreate } from "./challenge/create";
import { ChallengeList } from "./challenge/list";

import { ChallengeOptionList } from "./ChallengeOption/list";
import { ChallengeOptionCreate } from "./ChallengeOption/create";
import { ChallengeOptionEdit } from "./ChallengeOption/edit";

const dataProvider = simpleRestProvider("/api");

const App = () => {
    return (
        <Admin dataProvider={dataProvider}>
            <Resource
                name="courses"
                list={CourseList}
                create={CourseCreate}
                edit={CourseEdit}
                options={{ label: "Cursos" }}
            />

            <Resource
                name="units"
                list={UnitList}
                create={UnitCreate}
                edit={UnitEdit}
                options={{ label: "Unidades" }}
            />

            <Resource
                name="lessons"
                list={LessonList}
                create={LessonCreate}
                edit={LessonEdit}
                options={{ label: "Lecciones" }}
            />

            <Resource
                name="challenges"
                list={ChallengeList}
                create={ChallengeCreate}
                edit={ChallengeEdit}
                options={{ label: "Desafíos" }}
            />

            <Resource
                name="challengesOptions"
                list={ChallengeOptionList}
                create={ChallengeOptionCreate}
                edit={ChallengeOptionEdit}
                options={{ label: "Opciones de Desafío" }}
            />

        </Admin>
    );
};

export default App;