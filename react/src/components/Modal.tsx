import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useLocation } from "react-router";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Modal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isModal = !!location.state?.background;

    const [log, setLog] = useState(null);
    const [error, setError] = useState("");

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
                console.log(result.data);

                setLog(result.data);
            } catch (err) {
                if ((err as Error).name !== "AbortError")
                    setError((err as Error).message);
            }
        };

        fetchLog();
        return () => controller.abort();
    }, [id]);

    const handleDelete = () => {
        fetch(`http://127.0.0.1:8000/api/travel-logs/${id}`, {
            method: "DELETE",
        }).then(() => {
            navigate("/", { replace: true });
        });
    };

    return createPortal(
        <div
            className={`fixed inset-0 flex items-center justify-center ${
                isModal ? "backdrop-brightness-40 backdrop-blur-xs" : "bg-black"
            }`}
        >
            {log ? (
                <Card>
                    <CardHeader>
                        <CardTitle>{log?.type}</CardTitle>
                        <CardDescription>{log?.comment}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Departure place: {log?.departurePlace}</p>
                        <p>Arrival place: {log?.arrivalPlace}</p>
                    </CardContent>
                    <CardFooter className="block">
                        <p>Departure date: {formatDate(log?.departureDate)}</p>
                        <p>Arrival date: {formatDate(log?.arrivalDate)}</p>
                        <Button
                            className="bg-yellow mt-4"
                            onClick={() => navigate("/")}
                        >
                            Close
                        </Button>
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
                        <Button
                            onClick={() => navigate("/")}
                            className="bg-yellow mt-4"
                        >
                            Close
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>,
        document.body
    );
};

export default Modal;
