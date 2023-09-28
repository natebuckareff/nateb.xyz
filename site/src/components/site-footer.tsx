const START_YEAR = 2022;
const CURRENT_YEAR = new Date().getFullYear();
const COPYRIGHT_YEAR = `${START_YEAR}-${CURRENT_YEAR}`;

export default function SiteFooter() {
    return (
        <footer class="flex flex-wrap gap-1 text-slate-500 text-sm sm:text-base">
            <span>Copyright {COPYRIGHT_YEAR} Nate B</span>
            <span>(Nathaniel Buckareff)</span>
        </footer>
    );
}
