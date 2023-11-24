export interface SkillBubbleProps {
    children: string;
}

export default function SkillBubble(props: SkillBubbleProps) {
    return (
        <span class="text-sm sm:text-base rounded-md bg-slate-100 dark:bg-slate-700 dark:text-white print:text-gray-500 print:dark:text-gray-500 print:bg-transparent px-3 py-2">
            {props.children}
        </span>
    );
}
