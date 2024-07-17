"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExitModal } from "@/store/use-exit-modal";

export const ExitModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = useExitModal();

    useEffect(() => setIsClient(true), []);

    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <div>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image
                            src={"/mascot_sad.svg"}
                            alt="Mascot"
                            height={80}
                            width={80}
                        />
                    </div>
                    <div className="text-center font-bold text-2xl m-4">
                        ¡Espera, no te vayas!
                    </div>
                    <div className="text-center text-base font-light m-5">
                        Estas por salir de la lección. ¿Estás seguro?
                    </div>
                </div>
                < div className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button variant={"primary"} className="w-full" size={"lg"} onClick={close}>
                            ¡Seguir intentando!
                        </Button>
                        <Button variant={"dangerOutline"} className="w-full" size={"lg"} onClick={() => {
                            close();
                            router.push("/learn")
                        }}>
                            Salir
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}