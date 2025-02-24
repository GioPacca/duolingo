/* Componente */
"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useMount } from "react-use";

import { reduceHearts } from "@/actions/user-progress";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { challengeOptions, challenges } from "@/db/schema";
import { usePracticeModal } from "@/store/use-practice-modal";
import { upsertChallengeProgress } from "@/actions/challenge-progress";

import { Header } from "./header";
import { Footer } from "./footer";
import { Challenge } from "./challenge";
import { ResultCard } from "./result-card";
import { QuestionBubble } from "./question-bubble";

type Props = {
    initialPorcentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: (typeof challengeOptions.$inferSelect)[];
    })[];
    userSubscription: any;
};

export const Quiz = ({
    initialPorcentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
}: Props) => {
    const { open: openHeartsModal } = useHeartsModal();
    const { open: openPracticeModal } = usePracticeModal();

    useMount(() => {
        if(initialPorcentage == 100) {
            openPracticeModal();
        }
    })

    const router = useRouter();

    const [pending, startTransition] = useTransition();

    const [lessonId] = useState(initialLessonId);
    const [hearts, setHearts] = useState(initialHearts);
    const [porcentage, setPorcentage] = useState(() => {
        return initialPorcentage === 100 ? 0 : initialPorcentage;
    });
    const [challenges] = useState(initialLessonChallenges);
    /* <A> */
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    const challenge = challenges[activeIndex];

    /* <A/> */
    /* Con el bloque de código A obtengo aquel desafío que está activo, el desafío actual */
    const options = challenge?.challengeOptions ?? [];

    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };

    /* seleccionar */
    const onSelect = (id: number) => {
        if (status !== "none") return;

        setSelectedOption(id);
    }

    /* chequear */
    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        const correctOption = options.find((option) => option.correct);

        if (!correctOption) return;
        if (correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id).then((response) => {
                    if (response?.error === "hearts") {
                        openHeartsModal();
                        return;
                    }

                    setStatus("correct");
                    setPorcentage((prev) => prev + 100 / challenges.length);

                    if (initialPorcentage === 100) {
                        setHearts((prev) => Math.min(prev + 1, 5));
                    }
                }).catch(() => toast.error("Algo ha salido mal, intentalo de vuelta"))
            })
        }
        else {
            startTransition(() => {
                reduceHearts(challenge.id).then((response) => {
                    if (response?.error === "hearts") {
                        openHeartsModal();
                        return;
                    }

                    setStatus("wrong");

                    if (!response?.error) {
                        setHearts((prev) => Math.max(prev - 1, 0));
                    }
                }).catch(() => toast.error("Hubo un problema. Por favor intentalo de vuelta"))
            });
        }
    };

    /* IMPORTANTE ---->> Cuando completás los desafíos de una lección y no tenes más desafíos aparece un error por eso mismo, el siguiente "if" sirve para arreglarlo */
    if (!challenge) {
        return (
            <>
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image
                        src={"/finish.svg"}
                        alt="Finish"
                        className="hidden lg:block"
                        height={100}
                        width={100}
                    />
                    <Image
                        src={"/finish.svg"}
                        alt="Finish"
                        className="block lg:hidden"
                        height={100}
                        width={100}
                    />
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Esooo <br /> Completaste esta Lección!
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard
                            variant="points"
                            value={challenges.length * 10}
                        />
                        <ResultCard
                            variant="hearts"
                            value={hearts}
                        />
                    </div>
                </div>
                <Footer
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")}
                />
            </>
        )
    }

    /* Todo lo que esta abajo es lo que pasa dentro de una leccion */
    const title = challenge.type === "ASSIST"
        ? "Selecciona la opción correcta"
        : challenge.question;

    return (
        <>
            <Header
                hearts={hearts}
                porcentage={porcentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />

            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                            {title}
                        </h1>
                        <div>
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question} />
                            )}

                            <Challenge
                                options={options}
                                onSelect={onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                disabled={pending}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};