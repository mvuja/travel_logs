import { useTravelLogs } from "@/context/TravelLogsContext";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { formatDate } from "@/lib/utils";
import { capitalLetter } from "@/lib/utils";

import { Link, useLocation } from "react-router";

const Home = () => {
    const location = useLocation();

    const { logs } = useTravelLogs();

    return (
        <div>
            <h1>All of Your Travel Logs</h1>
            <ul className="grid grid-cols-4 gap-4">
                {logs.map((log) => (
                    <li key={log.id}>
                        <Link
                            to={`/travel-log/${log.id}`}
                            state={{ background: location }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {capitalLetter(log.type)}
                                    </CardTitle>
                                    <CardDescription>
                                        {log.comment || "No comment"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Departure place:{" "}
                                        {log.departurePlace || "--"}
                                    </p>
                                    <p>
                                        Arrival place:{" "}
                                        {log.arrivalPlace || "--"}
                                    </p>
                                </CardContent>
                                <CardFooter className="block">
                                    <p>
                                        Departure date:{" "}
                                        {formatDate(log.departureDate)}
                                    </p>
                                    <p>
                                        Arrival date:{" "}
                                        {formatDate(log.arrivalDate)}
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
