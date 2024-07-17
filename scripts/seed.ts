import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database");

        await db.delete(schema.challengeProgress);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challenges);
        await db.delete(schema.lessons);
        await db.delete(schema.units);
        await db.delete(schema.courses);
        await db.delete(schema.userProgress);

        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Spanish",
                imageSrc: "/es.svg",
            },
            {
                id: 2,
                title: "Italian",
                imageSrc: "/it.svg",
            },
            {
                id: 3,
                title: "French",
                imageSrc: "/fr.svg",
            },
            {
                id: 4,
                title: "Croatian",
                imageSrc: "/hr.svg",
            },
            {
                id: 5,
                title: "Japanese",
                imageSrc: "/jp.svg",
            },
        ]);

        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 3,
                title: "Unidad 1",
                description: "Aprende lo básico del Frances",
                order: 1,
            },
            {
                id: 2,
                courseId: 3,
                title: "Unidad 2",
                description: "Conversaciones del Frances",
                order: 1,
            },
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1,
                order: 1,
                title: "Ninguno",
            },
            {
                id: 2,
                unitId: 1,
                order: 2,
                title: "Verbos",
            },
            {
                id: 3,
                unitId: 1,
                order: 3,
                title: "Ninguno",
            },

            {
                id: 4,
                unitId: 1,
                order: 4,
                title: "Ninguno",
            },
            {
                id: 5,
                unitId: 1,
                order: 5,
                title: "Ninguno",
            },


        ]);

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1,
                type: "SELECT",
                order: 1,
                question: '¿Quien es el "homme"?',
            },
            {
                id: 2,
                lessonId: 1,
                type: "ASSIST",
                order: 2,
                question: '¿Cual es el "Perro"?',
            },
            {
                id: 3,
                lessonId: 1,
                type: "SELECT",
                order: 3,
                question: '¿Como se dice mujer?',
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 1,
                imageSrc: "/man.png",
                correct: true,
                text: "El hombre",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 1,
                imageSrc: "/woman.png",
                correct: false,
                text: "La mujer",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 1,
                imageSrc: "/dog.png",
                correct: false,
                text: "El perro",
                audioSrc: "/es_robot.mp3",
            }
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 2,
                correct: false,
                text: "Homme",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 2,
                correct: false,
                text: "Femme",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 2,
                correct: true,
                text: "Chien",
                audioSrc: "/es_robot.mp3",
            }
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 3,
                imageSrc: "/man.png",
                correct: false,
                text: "Homme",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 3,
                imageSrc: "/woman.png",
                correct: true,
                text: "Femme",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 3,
                imageSrc: "/dog.png",
                correct: false,
                text: "Chien",
                audioSrc: "/es_robot.mp3",
            }
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 4,
                lessonId: 2,
                type: "SELECT",
                order: 1,
                question: '¿Quien es el "homme"?',
            },
            {
                id: 5,
                lessonId: 2,
                type: "ASSIST",
                order: 2,
                question: '¿Cual es el "Perro"?',
            },
            {
                id: 6,
                lessonId: 2,
                type: "SELECT",
                order: 3,
                question: '¿Como se dice mujer?',
            },
        ]);


        console.log("Seeding finished");
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};

main();
