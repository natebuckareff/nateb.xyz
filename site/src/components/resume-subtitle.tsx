import differenceInMonths from 'date-fns/differenceInMonths';
import format from 'date-fns/format';

export interface ResumeSubtitleProps {
    image?: string;
    company: string;
    start: string;
    end: string;
}

export default function ResumeSubtitle(props: ResumeSubtitleProps) {
    const getDuration = () => {
        const difference = differenceInMonths(new Date(props.end), new Date(props.start));
        const months = difference % 12;
        const years = Math.floor(difference / 12);
        const parts: string[] = [];
        if (years > 0) {
            parts.push(`${years} year${years > 1 ? 's' : ''}`);
        }
        if (months > 0) {
            parts.push(`${months} month${months > 1 ? 's' : ''}`);
        }
        return parts.join(', ');
    };

    const getDate = (date: string) => {
        const d = new Date(date);
        const c = new Date();
        if (d.getFullYear() === c.getFullYear()) {
            return 'Present';
        } else {
            return format(d, 'LLL y');
        }
    };

    return (
        <div class="flex flex-col gap-2 text-slate-500">
            <div class="flex flex-row items-center font-bold">
                {props.image && <img class="inline no-invert h-5 pr-1.5" src={props.image} />}
                <div class="grow">{props.company}</div>
            </div>
            <div class="flex justify-between">
                <div>{getDuration()}</div>
                <div>
                    {getDate(props.start)} - {getDate(props.end)}
                </div>
            </div>
        </div>
    );
}
