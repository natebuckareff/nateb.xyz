import { cva } from 'class-variance-authority';
import { JSX, Match, Switch, splitProps } from 'solid-js';
import { createRouteAction } from 'solid-start';
import SendIcon from '~/components/icons/send-icon';

export default function Contact() {
    const [action, { Form }] = createRouteAction(async (formData: FormData) => {
        await new Promise(resolve => setTimeout(resolve, 2_000));
    });

    return (
        <main>
            <Form class="flex flex-col items-start gap-4 mx-auto max-w-lg">
                <div class="flex flex-col w-full">
                    <Label for="name">Name</Label>
                    <Input
                        class="max-w-sm"
                        type="text"
                        id="name"
                        placeholder="Your name"
                        required
                        disabled={action.pending}
                    />
                </div>

                <div class="flex flex-col w-full">
                    <Label for="email">Email</Label>
                    <Input
                        class="max-w-sm"
                        type="text"
                        id="email"
                        placeholder="Your email address"
                        required
                        disabled={action.pending}
                    />
                </div>

                <div class="flex flex-col w-full">
                    <Label for="message">Message</Label>
                    <textarea
                        id="message"
                        rows="4"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write your thoughts here..."
                        disabled={action.pending}
                    />
                </div>

                <Button class="flex items-center justify-center gap-0" disabled={action.pending}>
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
