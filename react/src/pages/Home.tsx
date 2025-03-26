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
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
    const location = useLocation();

    const { logs, loading, refetchLogs } = useTravelLogs();

    const isLoading = loading || !logs;

    return (
        <div>
            <h1>All of Your Travel Logs</h1>

            {isLoading ? (
                <ul className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <li key={index}>
                            <Card className="shadow-xl border border-slate-600">
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
                                </CardFooter>
                            </Card>
                        </li>
                    ))}
                </ul>
            ) : logs.length > 0 ? (
                <ul className="grid grid-cols-4 gap-4">
                    {logs.map((log) => (
                        <li key={log.id}>
                            <Link
                                to={`/travel-log/${log.id}`}
                                state={{ background: location }}
                            >
                                <Card className="shadow-xl border border-slate-600">
                                    <CardHeader>
                                        <CardTitle className="text-yellow">
                                            {capitalLetter(log.type)}
                                        </CardTitle>
                                        <CardDescription>
                                            {log.comment || "No comment"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            <span className="font-bold">
                                                Departure place:
                                            </span>{" "}
                                            {log.departurePlace || "--"}
                                        </p>
                                        <p>
                                            <span className="font-bold">
                                                Arrival place:
                                            </span>{" "}
                                            {log.arrivalPlace || "--"}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="block">
                                        <p>
                                            <span className="font-bold">
                                                Departure date:
                                            </span>{" "}
                                            {formatDate(log.departureDate)}
                                        </p>
                                        <p>
                                            <span className="font-bold">
                                                Arrival date:
                                            </span>{" "}
                                            {formatDate(log.arrivalDate)}
                                        </p>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="font-medium text-2xl mt-20 leading-10">
                    Sorry, looks like there are no travel logs found at the
                    moment :/
                    <br /> Click{" "}
                    <Link to="/create" className="text-yellow">
                        here
                    </Link>{" "}
                    if you would like to add some!
                </p>
            )}
        </div>
    );
};

export default Home;
