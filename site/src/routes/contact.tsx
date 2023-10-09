import { HttpHeader } from 'solid-start/server';
import Link from '~/components/link';
import SiteHeader from '~/components/site-header';
import SiteLayout from '~/components/site-layout';

export default function ContactPage() {
    return (
        <>
            {/* Cache for 1 hour */}
            <HttpHeader name="Cache-Control" value="public, max-age=3600, stale-if-error=60" />

            <SiteLayout>
                <SiteHeader />
                <div class="my-8">
                    <h1 class="text-4xl font-bold">Contact Information</h1>

                    <div class="grid grid-cols-2 mt-8 gap-8">
                        <div class="">
                            <h2 class="text-2xl font-bold">Email</h2>
                            <Link class="x-link" href="mailto:hello@nateb.xyz">
                                hello@nateb.xyz
                            </Link>
                        </div>

                        <div class="">
                            <h2 class="text-2xl font-bold">Discord</h2>
                            <Link class="x-link" href="https://discord.com/users/nate.b.">
                                nate.b.
                            </Link>
                        </div>

                        <div class="">
                            <h2 class="text-2xl font-bold">Social</h2>
                            <ul class="flex flex-col gap-1">
                                <li>
                                    <Link class="x-link" href="https://github.com/natebuckareff">
                                        GitHub
                                    </Link>
                                </li>

                                <li>
                                    <Link class="x-link" href="https://twitter.com/anynate">
                                        Twitter
                                    </Link>
                                </li>

                                <li>
                                    <Link class="x-link" href="https://t.me/nbxyz">
                                        Telegram
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </SiteLayout>
        </>
    );
}
