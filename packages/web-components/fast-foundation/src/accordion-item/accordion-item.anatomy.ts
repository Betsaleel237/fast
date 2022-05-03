import { ref } from "@microsoft/fast-element";
import { Anatomy, SlotOptions } from "../builder/anatomy.js";
import { build } from "../builder/template-builder.js";
import type { AccordionItem } from "./accordion-item.js";

type AccordionItemParts =
    | "region"
    | "heading"
    | "button"
    | "heading-content"
    | "start"
    | "end"
    | "icon"
    | "expanded-icon"
    | "collapsed-icon";

export class AccordionItemAnatomy extends Anatomy<AccordionItem, AccordionItemParts> {
    protected openCallback() {
        this.html`<template class="${x => (x.expanded ? "expanded" : "")}">`;
    }

    heading(callback: (a: AccordionItemHeadingAnatomy) => void) {
        this.internals.evaluateAnatomy(AccordionItemHeadingAnatomy, callback);
        return this;
    }

    defaultSlot() {
        const { part } = this.internals;

        return this.html`
            <div
                class="region"
                ${part("region")}
                id="${x => x.id}-panel"
                role="region"
                aria-labelledby="${x => x.id}"
            >
                <slot></slot>
            </div>
        `;
    }

    protected closeCallback(): void {
        this.html`</template>`;
    }
}

class AccordionItemHeadingAnatomy extends Anatomy<AccordionItem, AccordionItemParts> {
    private hasIconSection = false;

    protected openCallback(): void {
        const { part } = this.internals;

        this.html`
            <div class="heading"
                ${part("heading")}
                role="heading"
                aria-level="${x => x.headinglevel}"
            >
        `;
    }

    button(options?: Partial<SlotOptions>) {
        const { part } = this.internals;
        const slot = Object.assign({ name: "button", fallback: "" }, options);

        return this.html`
            <button
                class="button"
                ${part("button")}
                ${ref("expandbutton")}
                aria-expanded="${x => x.expanded}"
                aria-controls="${x => x.id}-panel"
                id="${x => x.id}"
                @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
                >
                <span class="heading-content" ${part("heading-content")}>
                    <slot name="${slot.name}">${slot.fallback}</slot>
                </span>
            </button>
        `;
    }

    startSlot(options?: Partial<SlotOptions>) {
        this.internals.slot(Object.assign({ name: "start" }, options), ref("start"));

        return this;
    }

    endSlot(options?: Partial<SlotOptions>) {
        this.internals.slot(Object.assign({ name: "end" }, options), ref("end"));

        return this;
    }

    expandedIcon(options?: Partial<SlotOptions>) {
        const { part, slot } = this.internals;

        this.ensureIconSection();

        slot(Object.assign({ name: "expanded-icon" }, options), part("expanded-icon"));

        return this;
    }

    collapsedIcon(options?: Partial<SlotOptions>) {
        const { part, slot } = this.internals;

        this.ensureIconSection();

        slot(Object.assign({ name: "collapsed-icon" }, options), part("collapsed-icon"));

        return this;
    }

    protected closeCallback(): void {
        if (this.hasIconSection) {
            this.html`</span>`;
        }

        this.html`</div>`;
    }

    private ensureIconSection() {
        const { part } = this.internals;

        if (!this.hasIconSection) {
            this.hasIconSection = true;
            this.html`<span class="icon" ${part("icon")} aria-hidden="true">`;
        }
    }
}

// default template
export function foundationAccordionItemTemplate() {
    return build(AccordionItemAnatomy)
        .anatomy(item =>
            item
                .heading(heading =>
                    heading
                        .button()
                        .startSlot()
                        .endSlot()
                        .expandedIcon({ fallback: "icon here" })
                        .collapsedIcon({ fallback: "icon here" })
                )
                .defaultSlot()
        )
        .build();
}

// custom adjustment
const customTemplate = build(AccordionItemAnatomy)
    .parts({
        button: "control",
        region: "content",
    })
    .anatomy(item =>
        item
            .heading(
                heading =>
                    heading.html`first`.button().startSlot({ name: "prefix" }).html`last`
            )
            .defaultSlot()
    )
    .build();
