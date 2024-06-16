import { moduleId } from "../../constants";
// import { Traits, Trait } from "../../types";
import CowboyBebopActor from "../documents/cowboybebopActor";

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
    html.find(".cowboy-actor-roll").on("click", this._onRollDice.bind(this));

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
    event.stopPropagation();
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
    event.stopPropagation();
    // Recup all the data from the event
    const name = (event.target as HTMLInputElement).value;
    const traitId = parseInt(
      (event.target as HTMLInputElement).dataset.index ?? "0"
    );
    const traitCategoryId = (event.target as HTMLInputElement).dataset.category;

    // Check if the data is valid
    if (traitCategoryId === undefined || traitId === undefined) return;

    // Save the new data
    await (this.actor as CowboyBebopActor).renameTrait(
      traitCategoryId,
      traitId,
      name
    );
  }

  // Damaged Trait
  private async _onDamageTrait(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // Recup all the data from the event
    const isDamaged = (event.target as HTMLInputElement).checked;
    const traitId = parseInt(
      (event.target as HTMLElement).dataset.index ?? "0"
    );
    const traitCategoryId = (event.target as HTMLElement).dataset.category;

    // Check if the data is valid
    if (traitCategoryId === undefined || traitId === undefined) return;

    // Save the new data
    await (this.actor as CowboyBebopActor).damageTrait(
      traitCategoryId,
      traitId,
      isDamaged
    );
  }

  // Roll Dice
  private async _onRollDice(event: Event) {
    console.log("Rolling dice");
    event.preventDefault();
    event.stopPropagation();
    // Recup all the data from the event
    const traitCategoryId = (event.target as HTMLElement).dataset.category;

    // Check if the data is valid
    if (traitCategoryId === undefined) return;

    // Save the new data
    await (this.actor as CowboyBebopActor).prepareDicePool(traitCategoryId);
  }
}
