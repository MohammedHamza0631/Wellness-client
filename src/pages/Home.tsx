import React, { useEffect, Suspense } from "react";
import { BackgroundBeamsDemo } from "@/components/example/BackgroundBeamsDemo";
import { SkeletonCard } from "@/components/SkeletonCard";
import RetreatSectionDemo from "@/components/example/RetreatSectionDemo";

const ExpandableCardDemo = React.lazy(() =>
    import("@/components/example/ExpandableCard")
);
function Home() {
    useEffect(() => {
        document.title = 'Home - Retreat'

    }, [])


    return (
        <div className='mr-2 ml-2'>
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
                {/* <ExpandableCardDemo  /> */}
                <RetreatSectionDemo />
            </Suspense>
        </div>
    )
}

export default Home
