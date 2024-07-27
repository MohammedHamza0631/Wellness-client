
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { SkeletonCard } from "../SkeletonCard";

type Retreat = {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    price: string;
    type: string;
    condition: string;
    image: string;
    duration: number;
    tags: string[];
    ctaLink?: string;
    ctaText?: string;
};

export default function ExpandableCardDemo() {
    const [cards, setCards] = useState<Retreat[]>([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(null);
    const id = useId();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRetreats = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/retreats");
                const data = await response.json();
                setCards(data);
            } catch (error) {
                console.error("Error fetching retreats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRetreats();
    }, [setLoading]);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(false);
            }
        }

        if (active && typeof active === "object") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
                {[...Array(22)].map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    }
    return (
        <>
            <AnimatePresence>
                {active && typeof active === "object" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 h-full w-full z-10"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active && typeof active === "object" ? (
                    <div className="fixed inset-0 grid place-items-center z-[100]">
                        <motion.button
                            key={`button-${active.title}-${id}`}
                            layout
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.05,
                                },
                            }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.title}-${id}`}
                            ref={ref}
                            className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
                        >
                            <motion.div layoutId={`image-${active.title}-${id}`}>
                                <img
                                    width={200}
                                    height={200}
                                    src={active.image}
                                    alt={active.title}
                                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                                />
                            </motion.div>

                            <div className="p-4 overflow-y-auto">
                                <div className="flex justify-between items-start p-4">
                                    <div>
                                        <motion.h3
                                            layoutId={`title-${active.title}-${id}`}
                                            className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.description}-${id}`}
                                            className="text-neutral-600 dark:text-neutral-400 text-base"
                                        >
                                            {active.description}
                                        </motion.p>
                                        <motion.p
                                            layoutId={`date-${active.date}-${id}`}
                                            className="text-neutral-600 dark:text-neutral-400 text-base"
                                        >
                                            Date: {new Date(active.date).toLocaleDateString()}
                                        </motion.p>
                                        <motion.p
                                            layoutId={`price-${active.price}-${id}`}
                                            className="text-neutral-600 dark:text-neutral-400 text-base"
                                        >
                                            Price: ${active.price}
                                        </motion.p>
                                    </div>

                                    <motion.a
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        href={active.ctaLink}
                                        target="_blank"
                                        className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                                    >
                                        Book
                                    </motion.a>

                                </div>
                                <div className="pt-4 relative px-4">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                                    >
                                        <p>Location: {active.location}</p>
                                        <p>Type: {active.type}</p>
                                        <p>Condition: {active.condition}</p>
                                        <p>Duration: {active.duration} days</p>
                                        <p>Tags: {active.tags.join(", ")}</p>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <ul className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-start gap-4">
                {cards.map((card) => (
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        key={card.id}
                        onClick={() => setActive(card)}
                        className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                    >
                        <div className="flex gap-4 flex-col w-full">
                            <motion.div layoutId={`image-${card.title}-${id}`}>
                                <img
                                    width={100}
                                    height={100}
                                    src={card.image}
                                    alt={card.title}
                                    className="h-60 w-full rounded-lg object-cover object-top"
                                />
                            </motion.div>
                            <div className="flex justify-center items-center flex-col">
                                <motion.h3
                                    layoutId={`title-${card.title}-${id}`}
                                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                                >
                                    {card.title}
                                </motion.h3>
                                <motion.p
                                    layoutId={`date-${card.date}-${id}`}
                                    className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                                >
                                    Date: {new Date(card.date).toLocaleDateString()}
                                </motion.p>
                                <motion.p
                                    layoutId={`price-${card.price}-${id}`}
                                    className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                                >
                                    Price: ${card.price}
                                </motion.p>
                                <motion.p
                                    layoutId={`location-${card.location}-${id}`}
                                    className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                                >
                                    Location: {card.location}
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </ul>

        </>
    );
}

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.15,
                },
            }}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.3002 5.70994C18.6902 6.09994 18.6902 6.72994 18.3002 7.11994L13.4202 11.9999L18.3002 16.8799C18.6902 17.2699 18.6902 17.8999 18.3002 18.2899C17.9102 18.6799 17.2802 18.6799 16.8902 18.2899L12.0002 13.4099L7.11023 18.2899C6.72023 18.6799 6.09023 18.6799 5.70023 18.2899C5.31023 17.8999 5.31023 17.2699 5.70023 16.8799L10.5802 11.9999L5.70023 7.11994C5.31023 6.72994 5.31023 6.09994 5.70023 5.70994C6.09023 5.31994 6.72023 5.31994 7.11023 5.70994L12.0002 10.5899L16.8902 5.70994C17.2802 5.31994 17.9102 5.31994 18.3002 5.70994Z"
                fill="#000"
            />
        </motion.svg>
    );
}; 
