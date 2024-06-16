import { moduleId } from "../../constants";
import { Traits, Trait } from "../../types";

export default class CowboyBebopItemSheet extends ActorSheet {
  // Define the template to use for this sheet
  override get template() {
    return `systems/${moduleId}/templates/sheets/actor/actor-sheet-${this.actor.type}.hbs`;
  }

  // Data to be passed to the template when rendering
  override async getData() {
    let data: any = super.getData();
    data.isGM = (game as Game).user?.isGM;
    return data;
  }

  // Event Listeners
  override activateListeners(html: JQuery) {
    super.activateListeners(html);
    // Roll handlers, click handlers, etc. would go here.

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html
      .find(".cowboy-health-action-button")
      .on("click", this._onDamage.bind(this));

    html
      .find(".cowboy-actor-trait-name")
      .on("change", this._onRenameTrait.bind(this));

    html
      .find(".cowboy-actor-trait-damaged")
      .on("change", this._onDamageTrait.bind(this));
  }

  // ========================================
  // Actions
  // ========================================

  // Handle damage
  private async _onDamage(event: Event) {
    event.preventDefault();
    const points = parseInt(
      (event.target as HTMLElement).getAttribute("data-value") || "0"
    );
    await this.actor.update({
      "system.cartridge": (this.actor as any).system.cartridge + points,
    });
  }

  // Rename Trait
  private async _onRenameTrait(event: Event) {
    event.preventDefault();
    console.log("Trait renamed");
    // Recup all the data from the event
    const name = (event.target as HTMLInputElement).value;
    const traitId = parseInt(
      (event.target as HTMLInputElement).dataset.index ?? "0"
    );
    const traitCategoryId = (event.target as HTMLInputElement).dataset.category;

    // Check if the data is valid
    if (traitCategoryId === undefined || traitId === undefined) return;

    // Save the new data
    await this.actor.update({
      "system.traits": this.renameTraitImut(
        (this.actor as any).system.traits,
        traitCategoryId,
        traitId,
        name
      ),
    });
  }

  // Damaged Trait
  private async _onDamageTrait(event: Event) {
    event.preventDefault();
    console.log("Trait damaged");
    // Recup all the data from the event
    const isDamaged = (event.target as HTMLInputElement).checked;
    const traitId = parseInt(
      (event.target as HTMLElement).dataset.index ?? "0"
    );
    const traitCategoryId = (event.target as HTMLElement).dataset.category;

    // Check if the data is valid
    if (traitCategoryId === undefined || traitId === undefined) return;

    // Save the new data
    await this.actor.update({
      "system.traits": this.damageTraitImut(
        (this.actor as any).system.traits,
        traitCategoryId,
        traitId,
        isDamaged
      ),
    });
  }

  // ========================================
  // Helpers
  // ========================================
  private renameTraitImut(
    traits: Traits,
    category: string,
    index: number,
    newName: string
  ): Traits {
    if (traits[category] && traits[category][index]) {
      return {
        ...traits,
        [category]: traits[category].map((trait: Trait, i: number) =>
          i === index ? { ...trait, name: newName } : trait
        ),
      };
    } else {
      console.error("Trait or category not found");
      return traits;
    }
  }

  private damageTraitImut(
    traits: Traits,
    category: string,
    index: number,
    newDamaged: boolean
  ): Traits {
    if (traits[category] && traits[category][index]) {
      return {
        ...traits,
        [category]: traits[category].map((trait: Trait, i: number) =>
          i === index ? { ...trait, damaged: newDamaged } : trait
        ),
      };
    } else {
      console.error("Trait or category not found");
      return traits;
    }
  }
}
