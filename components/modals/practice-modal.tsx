"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePracticeModal } from "@/store/use-practice-modal";

export const PracticeModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = usePracticeModal();

    useEffect(() => setIsClient(true), []);

    if (!isClient) {
        return null;
    }

    const toLearn = () => {
        close();
        router.push("/learn")
    };

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <div>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image
                            src={"/heart.svg"}
                            alt="Heart"
                            height={100}
                            width={100}
                        />
                    </div>
                    <div className="text-center font-bold text-2xl m-4">
                        Lección de Práctica
                    </div>
                    <div className="text-center text-base font-light m-5">
                        Practica las lecciones para obtener corazones y puntos <br /> No puedes perder corazones en las practicas
                    </div>
                </div>
                < div className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button
                            variant={"primary"}
                            className="w-full" size={"lg"}
                            onClick={close}>
                            ¡Entendido!
                        </Button>
                        <Button
                            variant={"dangerOutline"}
                            className="w-full" size={"lg"}
                            onClick={toLearn}>
                            Salir
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}