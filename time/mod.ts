export const timer = (label: string) => {
    return [
        () => console.time(label),
        () => console.timeEnd(label)
    ];
};