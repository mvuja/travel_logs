import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useLocation } from "react-router";
import { useTravelLogs } from "@/context/TravelLogsContext";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { capitalLetter } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Modal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { removeLog } = useTravelLogs();
    const isModal = !!location.state?.background;

    const [log, setLog] = useState(null);
    const [error, setError] = useState("");
    const [closing, setClosing] = useState(false);

    // Handle closing of the modal with animation
    const handleClose = () => {
        setClosing(true); // Trigger exit animation
        setTimeout(() => {
            navigate("/"); // Navigate after animation completes
        }, 300); // Wait for the duration of the animation (300ms)
    };

    useEffect(() => {
        const controller = new AbortController();
        const fetchLog = async () => {
            const url = `http://127.0.0.1:8000/api/travel-logs/${id}`;
            try {
                const response = await fetch(url, {
                    signal: controller.signal,
                });
                if (!response.ok)
                    throw new Error("Network response was not ok");
                const result = await response.json();

                setLog(result.data);
            } catch (err) {
                if ((err as Error).name !== "AbortError")
                    setError((err as Error).message);
            }
        };

        fetchLog();
        return () => controller.abort();
    }, [id]);

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/travel-logs/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete travel log");
            }

            removeLog(id);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Error deleting travel log:", error);
        }
    };

    return createPortal(
        <AnimatePresence>
            <div
                className={`fixed inset-0 flex items-center justify-center ${
                    isModal
                        ? "backdrop-brightness-40 backdrop-blur-xs"
                        : "bg-black"
                }`}
            >
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-white p-6 rounded-lg shadow-lg"
                >
                    {log ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {capitalLetter(log?.type)}
                                </CardTitle>
                                <CardDescription>
                                    {log?.comment}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Departure place: {log?.departurePlace}</p>
                                <p>Arrival place: {log?.arrivalPlace}</p>
                            </CardContent>
                            <CardFooter className="block">
                                <p>
                                    Departure date:{" "}
                                    {formatDate(log?.departureDate)}
                                </p>
                                <p>
                                    Arrival date: {formatDate(log?.arrivalDate)}
                                </p>
                                <div className="btns mt-4 flex justify-end gap-2">
                                    <Button onClick={handleClose}>Close</Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <Skeleton className="h-4 w-[50px] mb-1" />
                                </CardTitle>
                                <CardDescription>
                                    <Skeleton className="h-4 w-[80px] mb-3" />
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-[160px] mb-3" />
                                <Skeleton className="h-4 w-[140px]" />
                            </CardContent>
                            <CardFooter className="block">
                                <Skeleton className="h-4 w-[250px] mb-3" />
                                <Skeleton className="h-4 w-[230px]" />
                                <div className="btns mt-4 flex justify-end gap-2">
                                    <Button onClick={handleClose}>Close</Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
