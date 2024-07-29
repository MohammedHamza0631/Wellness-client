import React, { useEffect, Suspense } from "react";
import { BackgroundBeamsDemo } from "@/components/example/BackgroundBeamsDemo";
import { SkeletonCard } from "@/components/SkeletonCard";

const RetreatSectionDemo = React.lazy(() =>
    import("@/components/example/RetreatSectionDemo")
);
function Home() {
    useEffect(() => {
        document.title = 'Home - Retreat'

    }, [])


    return (
        <div className='px-4 md:px-2 lg:px-2'>
            <BackgroundBeamsDemo />
            <Suspense
                fallback={
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
                        {[...Array(22)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                }
            >
                <RetreatSectionDemo />
            </Suspense>
        </div>
    )
}

export default Home
