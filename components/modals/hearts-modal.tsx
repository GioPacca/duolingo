"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHeartsModal } from "@/store/use-hearts-modal";

export const HeartsModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = useHeartsModal();

    useEffect(() => setIsClient(true), []);

    const onClick = () => {
        close();
        router.push("/store")
    };

    const toLearn = () => {
        close();
        router.push("/learn")
    };


    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <div>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image
                            src={"/mascot_bad.svg"}
                            alt="Mascot"
                            height={80}
                            width={80}
                        />
                    </div>
                    <div className="text-center font-bold text-2xl m-4">
                        Te quedaste sin corazones
                    </div>
                    <div className="text-center text-base font-light m-5">
                        ¡Utilizaste todos tus corazones! <br /> Puedes comprar más en la tienda
                    </div>
                </div>
                < div className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button
                            variant={"primary"}
                            className="w-full"
                            size={"lg"}
                            onClick={onClick}>
                            Ir a la tienda
                        </Button>
                        <Button
                            variant={"dangerOutline"}
                            className="w-full" size={"lg"}
                            onClick={toLearn}>
                            No gracias
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}