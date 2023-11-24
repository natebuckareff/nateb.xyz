import differenceInMonths from 'date-fns/differenceInMonths';
import format from 'date-fns/format';

export interface ResumeSubtitleProps {
    company: string;
    start: string;
    end: string;
}

export default function ResumeSubtitle(props: ResumeSubtitleProps) {
    const getDuration = () => {
        const difference = differenceInMonths(new Date(props.end), new Date(props.start));
        const months = difference % 12;
        const years = Math.floor(difference / 12);
        return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
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
            <div class="font-bold">{props.company}</div>
            <div class="flex justify-between">
                <div>{getDuration()}</div>
                <div>
                    {getDate(props.start)} - {getDate(props.end)}
                </div>
            </div>
        </div>
    );
}
