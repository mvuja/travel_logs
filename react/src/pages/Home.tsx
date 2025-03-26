import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { formatDate } from "@/lib/utils";

import { Link, useLocation } from "react-router";

const Home = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const location = useLocation();

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
                setData(holder.reverse());
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

    return (
        <div>
            <h1>Posts</h1>
            <ul className="grid grid-cols-4 gap-4">
                {data.map((post) => (
                    <li key={post.id}>
                        <Link
                            to={`/travel-log/${post.id}`}
                            state={{ background: location }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>{post.type}</CardTitle>
                                    <CardDescription>
                                        {post.comment}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Departure place: {post.departurePlace}
                                    </p>
                                    <p>Arrival place: {post.arrivalPlace}</p>
                                </CardContent>
                                <CardFooter className="block">
                                    <p>
                                        Departure date:{" "}
                                        {formatDate(post.departureDate)}
                                    </p>
                                    <p>
                                        Arrival date:{" "}
                                        {formatDate(post.arrivalDate)}
                                    </p>
                                </CardFooter>
                            </Card>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
