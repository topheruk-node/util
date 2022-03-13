class ObservableArray<T> extends Array<T> {
    // TODO: add type saftey 
    onpush: Function | null;
    constructor(onpush: Function | null, ...els: T[]) {
        super(...els);
        this.onpush = onpush;

        if (this.onpush) {
            this.onpush(this);
        }
    }
    push(...items: any[]): number {
        let n = super.push(...items);
        if (this.onpush) {
            this.onpush(this);
        }
        return n;
    }
}

const onpush = (array: string[]) => {
    const list = document.getElementById("my-list");
    if (!list) return;

    list.innerHTML = "";
    for (const name of array) {
        list.insertAdjacentHTML("beforeend", `<li>${name}</li>`);
    }
};

class F extends Event {
    constructor(type: string, eventInitDict?: EventInit | undefined) {
        super(type, eventInitDict);
    }
    findTarget() { }
}

let e: Event = new Event("click", {});



const f = new F(e.type);

// TODO: my function variable has no idea about the items
const names = new ObservableArray(onpush, 1, 2, 3);

const arr = new Array<string | number>("a", "b");