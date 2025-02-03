'use client'

import { usePathname } from 'next/navigation';
import Countdown, { zeroPad } from "react-countdown";

type Props = {
    auctionEnd: string;
};

const styles = {
    container: {
        border: '2px solid white',
        color: 'white',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.5rem',
        display: 'flex',
        justifyContent: 'center' as const,
        textAlign: 'center' as const,
        fontSize: '1.2rem', 
    },
    finished: {
        backgroundColor: '#dc2626', 
    },
    warning: {
        backgroundColor: '#d97706', 
    },
    active: {
        backgroundColor: '#16a34a', 
    },
};

const renderer = ({ days, hours, minutes, seconds, completed }: { days: number, hours: number, minutes: number, seconds: number, completed: boolean }) => {
    const countdownStyle = completed
        ? styles.finished
        : (days === 0 && hours < 10)
        ? styles.warning
        : styles.active;

    return (
        <div style={{ ...styles.container, ...countdownStyle }}>
            {completed ? (
                <span>Đã hoàn thành</span>
            ) : (
                <span suppressHydrationWarning={true}>
                    {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
                </span>
            )}
        </div>
    );
};

const CountdownTimer=({ auctionEnd }: Props)=> {
    const pathname = usePathname();

    const auctionFinished =()=> {
        if (pathname.startsWith('/auction')) {
        }
    }

    return (
        <div>
            <Countdown date={auctionEnd} renderer={renderer} onComplete={auctionFinished} />
        </div>
    );
}
export default CountdownTimer