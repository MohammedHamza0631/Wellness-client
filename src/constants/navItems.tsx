import { IconHome, IconUser } from '@tabler/icons-react';

export const navItems = [
    {
        name: "Home",
        link: "/",
        icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "Signup",
        link: "/signup",
        icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
];