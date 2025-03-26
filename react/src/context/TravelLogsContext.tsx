import { createContext, useContext, useEffect, useState } from "react";

// Define the context type
type TravelLogsContextType = {
    logs: any[];
    removeLog: (id: string) => void;
};

// Create context
const TravelLogsContext = createContext<TravelLogsContextType | undefined>(
    undefined
);

// Context Provider
export const TravelLogsProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            const url = "http://127.0.0.1:8000/api/travel-logs";
            try {
                const response = await fetch(url, {
                    signal: controller.signal,
                });
                if (!response.ok)
                    throw new Error("Network response was not ok");
                const result = await response.json();

                const holder = result.data;
                setLogs(holder.reverse());
            } catch (err) {
                if ((err as Error).name !== "AbortError")
                    setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, []);

    // Function to remove a log from state
    const removeLog = (id: string) => {
        setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
    };

    return (
        <TravelLogsContext.Provider value={{ logs, removeLog }}>
            {children}
        </TravelLogsContext.Provider>
    );
};

// Custom hook to use travel logs
export const useTravelLogs = () => {
    const context = useContext(TravelLogsContext);
    if (!context) {
        throw new Error(
            "useTravelLogs must be used within a TravelLogsProvider"
        );
    }
    return context;
};
