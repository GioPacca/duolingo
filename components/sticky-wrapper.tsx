type Props = {
    children: React.ReactNode;
};

export const StickyWrapper = ({children}: Props) => {
    return(
        <div className="hidden lg:block w-[36px] sticky self-end bottom-6">
            <div className="min-h-[calc(100vh-48px)] sticky top-6 flex flex-col gap-y-4">
                {/* min-h-[calc(100vh-48px)] ---> 100 virtualhigh de 48px */}
                {children}
            </div>
        </div>
    );
};