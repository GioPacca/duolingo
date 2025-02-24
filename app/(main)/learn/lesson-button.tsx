"use client";

import Link from "next/link";
import { Check, Crown, Star } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import "react-circular-progressbar/dist/styles.css";

type Props = {
    id: number;
    index: number;
    totalCount: number;
    locked?: boolean;
    current?: boolean;
    porcentage: number;
};

export const LessonButton = ({
    id,
    index,
    totalCount,
    locked,
    current,
    porcentage,

}: Props) => {
    const cycleLength = 8;
    const cycleIndex = index % cycleLength;

    let indentationLevel;

    if (cycleIndex <= 2) {
        indentationLevel = cycleIndex;
    } else if (cycleIndex <= 4) {
        indentationLevel = 4 - cycleIndex;
    } else if (cycleIndex <= 6) {
        indentationLevel = 4 - cycleIndex;
    } else {
        indentationLevel = cycleIndex - 8;
    }

    const rightPosition = indentationLevel * 40;

    const isFirst = index === 0;
    const isLast = index === totalCount;

    /* La lección está completa si no hay "challenges" concurrentes o no hay más "challenges" bloqueados */
    const isCompleted = !current && !locked;

    /* Icono dinámico. Si está completo elegirá un check, si es el último elegirá una corona y en otros casos elegirá una estrella */
    const Icon = isCompleted ? Check : isLast ? Crown : Star;

    const href = isCompleted ? `/lesson/${id}` : "/lesson";

    return (
        /* Acá se imprimen las lecciones circulares */
        <Link href={href}
            aria-disabled={locked}
            style={{ pointerEvents: locked ? "none" : "auto" }}>
            <div className="relative" style={{
                right: `${rightPosition}px`,
                marginTop: isFirst && !isCompleted ? 60 : 24,
            }}>
                {current ? (
                    <div className="h-[102px] w-[102px] relative">
                        <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-green-500 bg-white rounded-xl animate-bounce tracking-wide z-10">
                            Start
                            {/* Lo que hace saltar el boton es la propiedad Boucing */}
                            <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2">
                                {/* triangulito gris debajo del boton */}
                            </div>
                        </div>
                        <CircularProgressbarWithChildren
                            value={Number.isNaN(porcentage) ? 0 : porcentage}
                            styles={{
                                path: {
                                    stroke: "#4ade80",
                                },
                                trail: {
                                    stroke: "e5e7eb",
                                }
                            }}>
                            <Button size={"rounded"}
                                variant={locked ? "locked" : "secondary"}
                                className="h-[70px] w-[70px] border-b-8">
                                <Icon className={cn("h-10 w-10",
                                    locked ? "fill-neutral-400 text-neutral-400 stroke-neutral-400" : "fill-prymary-foreground text-primary-foreground",
                                    isCompleted && "filll-one stroke-[4]")}
                                /* Este "Icon" lo creamos como constante en la parte superior */
                                />
                            </Button>
                        </CircularProgressbarWithChildren>
                    </div>
                ) : (
                    <Button size={"rounded"}
                        variant={locked ? "locked" : "secondary"}
                        className="h-[70px] w-[70px] border-b-8">
                        <Icon className={cn("h-10 w-10",
                            locked ? "fill-neutral-400 text-neutral-400 stroke-neutral-400" : "fill-prymary-foreground text-primary-foreground",
                            isCompleted && "filll-one stroke-[4]")}
                        /* Este "Icon" lo creamos como constante en la parte superior */
                        />
                    </Button>

                )}
            </div>
        </Link>
    );
};