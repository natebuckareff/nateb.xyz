import { APIEvent } from 'solid-start';
import { analyticsService } from '~/analytics-service';

export async function POST({ request }: APIEvent) {
    analyticsService.emitFromRequest(request);
    return new Response(null, { status: 200 });
}
