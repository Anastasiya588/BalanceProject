export type SignUpFieldType = {
    name: string,
    id: string,
    element: HTMLElement | null,
    regex?: RegExp,
    valid: boolean,
}