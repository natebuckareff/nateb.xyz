import { HttpHeader } from 'solid-start/server';
import ObfuscatedLink from '~/components/obfuscated-link';
import SiteHeader from '~/components/site-header';
import SiteLayout from '~/components/site-layout';

const CONTACT_KEY = [180, 41, 144, 235, 116, 68, 185, 93];

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
                            <ObfuscatedLink
                                class="x-link"
                                key={CONTACT_KEY}
                                href="d948f987002b8335d145fc84342ad829d14bbe930d3e"
                                text="dc4cfc871b04d73cc04cf2c50c3dc3"
                                autohide
                            />
                        </div>

                        <div class="">
                            <h2 class="text-2xl font-bold">Discord</h2>
                            <ObfuscatedLink
                                class="x-link"
                                key={CONTACT_KEY}
                                href="dc5de49b077e9672d040e3881b36dd73d746fdc40137dc2fc706fe8a0021973f9a"
                                text="da48e48e5a2697"
                                autohide
                            />
                        </div>

                        <div class="">
                            <h2 class="text-2xl font-bold">Social</h2>
                            <ul class="flex flex-col gap-1">
                                <li>
                                    <ObfuscatedLink
                                        class="x-link"
                                        key={CONTACT_KEY}
                                        href="dc5de49b077e9672d340e4830126973edb44bf851530dc3fc14afb8a0621df3b"
                                        text="f340e4a30126"
                                        autohide
                                    />
                                </li>

                                <li>
                                    <ObfuscatedLink
                                        class="x-link"
                                        key={CONTACT_KEY}
                                        href="dc5de49b077e9672c05ef99f0021cb73d746fdc4152ac033d55df5"
                                        text="e05ef99f0021cb"
                                        autohide
                                    />
                                </li>

                                <li>
                                    <ObfuscatedLink
                                        class="x-link"
                                        key={CONTACT_KEY}
                                        href="dc5de49b077e9672c007fd8e5b2adb25cd53"
                                        text="e04cfc8e1336d830"
                                        autohide
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </SiteLayout>
        </>
    );
}
