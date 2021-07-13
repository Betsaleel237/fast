import { html, ref, ViewTemplate, when } from "@microsoft/fast-element";
import { AnchoredRegion } from "../anchored-region";
import type { Picker } from "./picker";
import { PickerMenu } from "./picker-menu";
import { PickerMenuOption } from "./picker-menu-option";
import { PickerList } from "./picker-list";
import { PickerListItem } from "./picker-list-item";

function createListItemTemplate(context): ViewTemplate {
    const pickerListItemTag: string = context.tagFor(PickerListItem);
    return html`
    <${pickerListItemTag}
        @click="${(x, c) => c.parent.handleItemClick(c.event as MouseEvent, c.index)}"
        @keydown="${(x, c) =>
            c.parent.handleItemKeyDown(c.event as KeyboardEvent, c.index)}"
        value="${x => x}"
    >
    </${pickerListItemTag}>
    `;
}

function createMenuOptionTemplate(context): ViewTemplate {
    const pickerMenuOptionTag: string = context.tagFor(PickerMenuOption);
    return html`
    <${pickerMenuOptionTag}
        @click="${(x, c) => c.parent.handleOptionClick(c.event as MouseEvent, x)}"
        value="${x => x}"
    >
    </${pickerMenuOptionTag}>
    `;
}

/**
 * The template for the List Picker component.
 * @public
 */
export const pickerTemplate: (context, definition) => ViewTemplate<Picker> = (
    context,
    definition
) => {
    const anchoredRegionTag: string = context.tagFor(AnchoredRegion);
    const pickerMenutag: string = context.tagFor(PickerMenu);
    const pickerListtag: string = context.tagFor(PickerList);
    const listItemTemplate: ViewTemplate = createListItemTemplate(context);
    const menuOptionTemplate: ViewTemplate = createMenuOptionTemplate(context);
    return html<Picker>`
        <template
            :selectedlisttag="${() => pickerListtag}"
            :pickermenutag="${() => pickerMenutag}"
            :defaultListItemTemplate="${listItemTemplate}"
            :defaultMenuOptionTemplate="${menuOptionTemplate}"
            @focusin="${(x, c) => x.handleFocusIn(c.event as FocusEvent)}"
            @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
            @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
            @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
        >
            <slot name="list-region"></slot>

            ${when(
                x => x.flyoutOpen,
                html<Picker>`
                <${anchoredRegionTag}
                    class="region"
                    auto-update-mode="${x =>
                        x.menuConfig.autoUpdateMode !== undefined
                            ? x.menuConfig.autoUpdateMode
                            : "auto"}"
                    fixed-placement="${x =>
                        x.menuConfig.fixedPlacement !== undefined
                            ? x.menuConfig.fixedPlacement
                            : true}"
                    vertical-positioning-mode="${x =>
                        x.menuConfig.verticalPositioningMode}"
                    vertical-default-position="${x =>
                        x.menuConfig.verticalDefaultPosition}"
                    vertical-scaling="${x => x.menuConfig.verticalScaling}"
                    vertical-inset="${x => x.menuConfig.verticalInset}"
                    vertical-threshold="${x => x.menuConfig.verticalThreshold}"
                    horizontal-positioning-mode="${x =>
                        x.menuConfig.horizontalPositioningMode}"
                    horizontal-default-position="${x =>
                        x.menuConfig.horizontalDefaultPosition}"
                    horizontal-scaling="${x => x.menuConfig.horizontalScaling}"
                    horizontal-inset="${x => x.menuConfig.horizontalInset}"
                    horizontal-threshold="${x => x.menuConfig.horizontalThreshold}"
                    @loaded="${(x, c) => x.handleRegionLoaded(c.event as Event)}"
                    ${ref("region")}
                >
                    ${when(
                        x => !x.showNoOptions && !x.showLoading,
                        html<Picker>`
                            <slot name="menu-region"></slot>
                        `
                    )}
                    ${when(
                        x => x.showNoOptions && !x.showLoading,
                        html<Picker>`
                            <div class="no-options-display" part="no-options-display">
                                <slot name="no-options-region">
                                    ${x => x.noSuggestionsText}
                                </slot>
                            </div>
                        `
                    )}
                    ${when(
                        x => x.showLoading,
                        html<Picker>`
                            <div class="loading-display" part="loading-display">
                                <slot name="loading-region">
                                    <fast-progress-ring
                                        part="loading-progress"
                                        class="loading-progress
                                        slot="loading-region"
                                    ></fast-progress-ring>
                                    ${x => x.loadingText}
                                </slot>
                            </div>
                        `
                    )}
                </${anchoredRegionTag}>
            `
            )}
        </template>
    `;
};
