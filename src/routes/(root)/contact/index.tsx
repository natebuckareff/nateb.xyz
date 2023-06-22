import { cva } from 'class-variance-authority';
import { JSX, Match, Show, Switch, createEffect, createSignal, splitProps } from 'solid-js';
import { createServerAction$ } from 'solid-start/server';
import { z } from 'zod';
import SendIcon from '~/components/icons/send-icon';
import { messageService } from '~/message-service';

const MESSAGE_MAX_LENGTH = 1_024;

const formSchema = z.object({
    name: z.string().max(64),
    email: z.string().max(64),
    message: z.string().max(MESSAGE_MAX_LENGTH),
});

export default function Contact() {
    const [action, { Form }] = createServerAction$(async (formData: FormData) => {
        await new Promise(resolve => setTimeout(resolve, 2_000));
        const value = formSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        });
        messageService.appendMessage(value);
        return new Response(null, { status: 200 });
    });

    const [getSuccess, setSuccess] = createSignal<string>();
    const [getError, setError] = createSignal<string>();
    const [getMessageLength, setMessageLength] = createSignal(MESSAGE_MAX_LENGTH);

    const handleMessageInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = e => {
        setMessageLength(MESSAGE_MAX_LENGTH - e.currentTarget.value.length);
    };

    let nameRef: HTMLInputElement;
    let emailRef: HTMLInputElement;
    let messageRef: HTMLTextAreaElement;

    createEffect(() => {
        if (action.error) {
            setError();
            setError('Failed to send message');
        }

        if (action.result?.ok === true) {
            nameRef.value = '';
            emailRef.value = '';
            messageRef.value = '';

            setSuccess('Message sent.');
            setError();
            setMessageLength(MESSAGE_MAX_LENGTH);
        }
    });

    const alertStyle = cva(
        ['p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400'],
        {
            variants: {
                error: {
                    true: 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400',
                },
            },
        }
    );

    const badgeStyle = cva(
        [
            'bg-green-100 text-green-800 text-xs font-medium',
            'px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300',
        ],
        {
            variants: {
                red: {
                    true: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                },
            },
        }
    );

    return (
        <main class="flex flex-col gap-5 mx-auto w-full max-w-lg">
            <h1 class="font-bold text-4xl mb-4">Contact</h1>

            <Form class="flex flex-col items-start gap-4 w-full">
                <div class="flex flex-wrap gap-4 w-full">
                    <Show when={getSuccess()}>
                        {success => (
                            <div class={alertStyle({ class: 'w-full mb-4' })} role="alert">
                                <span class="font-medium">{success()}</span>
                            </div>
                        )}
                    </Show>

                    <Show when={getError()}>
                        {error => (
                            <div
                                class={alertStyle({ class: 'w-full mb-4', error: true })}
                                role="alert"
                            >
                                <span class="font-medium">{error()}</span>
                            </div>
                        )}
                    </Show>

                    <div class="flex flex-col grow min-w-[50px]">
                        <Label for="name">Name</Label>
                        <Input
                            ref={nameRef!}
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your name"
                            required
                            disabled={action.pending}
                        />
                    </div>

                    <div class="flex flex-col grow min-w-[50px]">
                        <Label for="email">Email</Label>
                        <Input
                            ref={emailRef!}
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Your email address"
                            required
                            disabled={action.pending}
                        />
                    </div>
                </div>

                <div class="flex flex-col w-full">
                    <div class="flex items-start">
                        <Label for="message">Message</Label>

                        <Switch>
                            <Match when={getMessageLength() > 0}>
                                <Show when={getMessageLength() < MESSAGE_MAX_LENGTH - 32}>
                                    <div class={badgeStyle({ class: 'ml-auto' })}>
                                        {getMessageLength()}
                                    </div>
                                </Show>
                            </Match>

                            <Match when={getMessageLength() <= 0}>
                                <div class={badgeStyle({ class: 'ml-auto', red: true })}>
                                    {getMessageLength()}
                                </div>
                            </Match>
                        </Switch>
                    </div>

                    <textarea
                        ref={messageRef!}
                        id="message"
                        name="message"
                        rows="4"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write your thoughts here..."
                        disabled={action.pending}
                        onInput={handleMessageInput}
                    />
                </div>

                <Button class="flex items-center justify-center" disabled={action.pending}>
                    <Switch>
                        <Match when={!action.pending}>
                            <SendIcon class="w-4 h-4 mr-2" /> Send
                        </Match>

                        <Match when={action.pending}>
                            <Spinner /> Send
                        </Match>
                    </Switch>
                </Button>
            </Form>
        </main>
    );
}

const Label = (props: JSX.LabelHTMLAttributes<HTMLLabelElement>) => {
    const [split, rest] = splitProps(props, ['class']);
    const labelStyle = cva(['block mb-2 text-sm font-medium text-gray-900 dark:text-white']);
    return <label class={labelStyle({ class: split.class })} {...rest} />;
};

const Input = (props: JSX.InputHTMLAttributes<HTMLInputElement>) => {
    const [split, rest] = splitProps(props, ['class']);
    const inputStyle = cva(
        [
            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg',
            'focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
            'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white',
            'dark:focus:ring-blue-500 dark:focus:border-blue-500',
        ],
        {
            variants: {
                disabled: {
                    true: 'bg-gray-100 cursor-not-allowed dark:text-gray-400',
                },
            },
        }
    );
    return <input class={inputStyle({ disabled: rest.disabled, class: split.class })} {...rest} />;
};

const Button = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const [split, rest] = splitProps(props, ['class']);
    const buttonStyle = cva(
        [
            props.class,
            'w-full sm:w-fit',
            'text-white bg-blue-700 hover:bg-blue-800',
            'focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base pl-4 px-5 py-2.5',
            'dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800',
        ],
        {
            variants: {
                disabled: {
                    true: 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed pointer-events-none',
                },
            },
        }
    );
    return (
        <button class={buttonStyle({ disabled: rest.disabled, class: split.class })} {...rest} />
    );
};

const Spinner = () => {
    return (
        <div role="status">
            <svg
                aria-hidden="true"
                class="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                />
            </svg>
            <span class="sr-only">Loading...</span>
        </div>
    );
};
