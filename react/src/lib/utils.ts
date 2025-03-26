import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
    const date = new Date(dateString?.replace(" ", "T"));

    let options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };

    let formattedDate = date.toLocaleString("en-US", options);

    // Remove ":00" when minutes are zero
    formattedDate = formattedDate.replace(/:00(?=[\sAPM])/g, "");

    return formattedDate;
}

export function capitalLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
