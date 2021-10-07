import { attr, FASTElement, html, observable } from "@microsoft/fast-element";

export class Bindings extends FASTElement {
    @attr
    attribute: string = "";

    @attr({ mode: "boolean" })
    boolean: boolean = false;

    @observable
    property: string = "";
}

FASTElement.define(Bindings, {
    name: "fast-bindings",
    /*html*/
    template: html<Bindings>`
        <dl>
            <dt>Attribute</dt>
            <dd>${(x: Bindings): string => x.attribute}</dd>
            <dt>Boolean</dt>
            <dd>${(x: Bindings): boolean => x.boolean}</dd>
            <dt>Property</dt>
            <dd>${(x: Bindings): string => x.property}</dd>
        </dl>
    `,
});
