const URL_REGEX = /^([a-z]+:\/\/)?([^/?]*)?(?<pathname>\/[^?]*)(\?[^?]*)?$/;

export function getURLPathname(url: string): string | undefined {
    return url.match(URL_REGEX)?.groups?.pathname;
}
