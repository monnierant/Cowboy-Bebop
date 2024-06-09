import { moduleId } from "../../constants";

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
    html
      .find(".cowboy-health-action-button")
      .on("click", this._onDamage.bind(this));

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;
  }

  // Actions

  // Handle damage
  private async _onDamage(event: Event) {
    event.preventDefault();
    const points = parseInt(
      (event.target as HTMLElement).getAttribute("data-value") || "0"
    );
    console.log("Damage clicked", points);
    await this.actor.update({
      "system.cartridge": (this.actor as any).system.cartridge + points,
    });
  }
}
