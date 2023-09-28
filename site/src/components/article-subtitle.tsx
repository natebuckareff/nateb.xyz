import { Show } from 'solid-js';

export default function ArticleSubtitle(props: { readtime: number; published?: Date }) {
    const getMinutes = () => `${props.readtime} minute${props.readtime !== 1 ? 's' : ''} read time`;
    return (
        <div class="x-subtitle">
            <span>{getMinutes()}</span>
            <Show when={props.published}>{published => <span>{formatDate(published())}</span>}</Show>
        </div>
    );
}

// prettier-ignore
const MONTHS_FULL = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = MONTHS_FULL[date.getMonth()];
    const day = date.getDate();
    return `${month} ${formatOrdinalSuffix(day)}, ${year}`;
}

function formatOrdinalSuffix(day: number) {
    // 1st
    if (day % 10 === 1 && day !== 11) {
        return day + 'st';
    }

    // 2nd
    if (day % 10 === 2 && day !== 12) {
        return day + 'nd';
    }

    // 3rd
    if (day % 10 === 3 && day !== 13) {
        return day + 'rd';
    }

    // nth
    return day + 'th';
}
