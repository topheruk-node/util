/** 
 * FIXME: need to resolve this function.
 * naive approach that likely does nothing against
 * non-escaped characters.
 * 
 * also does not deal with formatting. basically does
 * the job for now, but something I would like to work on
 * 
 * css styles also fails when trying to do display grid
 * 
 * ```ts
 * html`<div>Hello World</h1>`
 * ```
 */
export const html = (literals: TemplateStringsArray, ...values: any[]) => {
    const template = document.createElement("template");
    template.innerHTML = String.raw(literals, ...values);
    return template.content.cloneNode((true));
};

// const stylesheet = (literals: TemplateStringsArray, ...values: string[]) => {
//     const res = String.raw(literals, ...values);
//     const style = document.createElement('style');
//     updateTextContent(style)`@import url("./pub/css/component/${res}")`;
//     return style.cloneNode(true);
// };