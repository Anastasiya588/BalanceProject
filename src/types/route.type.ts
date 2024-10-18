export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: string,
    load: () => void,
    styles?: string[],
    scripts?: string[],
}
