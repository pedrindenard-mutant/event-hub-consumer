/**
 * Returns a formatted timestamp string in the format "DD/MM/YY - HH:MM:SS".
 *
 * @param date - The Date object to format. Defaults to the current date and time if not provided.
 * @returns A string representing the given date in "DD/MM/YY - HH:MM:SS" format.
 */
export const timestamp = (
    date: Date = (new Date)
): string => {
    const day   = String(date.getDate()          ).padStart(2, "0");
    const month = String(date.getMonth()    + 1  ).padStart(2, "0");
    const year  = String(date.getFullYear() % 100).padStart(2, "0");
    
    const hour  = String(date.getHours()  ).padStart(2, "0");
    const min   = String(date.getMinutes()).padStart(2, "0");
    const sec   = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hour}:${min}:${sec}`;
};