import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";
import { InfinityIcon, X } from "lucide-react";
import Image from "next/image";

type Props ={
    hearts: number;
    porcentage: number;
    hasActiveSubscription: boolean;
};

export const Header = ({
    hearts,
    porcentage,
    hasActiveSubscription,
}: Props) => {
    /* es una constante que llama al modal "useExitModal" y almacena el resultado para realizar las funciones */
    const { open } = useExitModal();

    return (
        <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
            <X 
            onClick={open}
            className="text-slate-500 hover:opacity-75 transition cursor-pointer"
            />

            <Progress value={porcentage} /> 
            <div className="text-rose-500 flex items-center font-bold">
                <Image 
                src={"/heart.svg"}
                height={28}
                width={28}
                alt="Heart"
                className="mr-2"
                />
                {hasActiveSubscription
                 ? <InfinityIcon className="h-6 w-6 stroke[3]" /> : hearts
                }
            </div>
        </header>
    )
}