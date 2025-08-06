import { formatTimeToSeconds } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Timer({ startedAt }: { startedAt: string }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(Date.now() - new Date(startedAt).getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [startedAt]);

    return <div>{formatTimeToSeconds(time)}</div>
}