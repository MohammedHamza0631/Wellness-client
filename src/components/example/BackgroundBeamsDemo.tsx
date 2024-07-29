"use client";

import { BackgroundBeams } from "../ui/background-beams";


export function BackgroundBeamsDemo() {

    return (
        <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
            <div className="max-w-2xl mx-auto p-4">
                <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
                    Wellness Retreat
                </h1>
                <br />
                <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
                    Welcome to our Wellness Retreat, your sanctuary for relaxation and rejuvenation.
                    Experience tranquility with our tailored services, from yoga and meditation to
                    spa treatments and wellness workshops. Discover the perfect escape to nurture
                    your mind, body, and spirit.
                </p>
                <br />

            </div>
            <BackgroundBeams />
        </div>
    );
}
