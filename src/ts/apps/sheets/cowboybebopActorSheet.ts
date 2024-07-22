import { moduleId, genres } from "../../constants";
// import { Traits, Trait } from "../../types";
import CowboyBebopActor from "../documents/cowboybebopActor";

export default class CowboyBebopItemSheet extends ActorSheet {
  private genreSelected: string | undefined = undefined;
  private typeSelected: string | undefined = undefined;

  // Define the template to use for this sheet
  override get template() {
    return `systems/${moduleId}/templates/sheets/actor/actor-sheet-${this.actor.type}.hbs`;
  }

  // Data to be passed to the template when rendering
  override async getData() {
    let data: any = super.getData();
    data.isGM = (game as Game).user?.isGM;
    data.genres = genres;
    data.genreSelected = this.genreSelected; // To remove when will be used to fill a cadran
    data.typeSelected = this.typeSelected; // to remove when will be used to fill a cadran
    return data;
  }

  // Event Listeners
  override activateListeners(html: JQuery) {
    super.activateListeners(html);
    // Roll handlers, click handlers, etc. would go here.
    html.find(".cowboy-actor-roll").on("click", this._onRollDice.bind(this));

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    if (this.actor.type === "chasseur") {
      this.activateListenersPC(html);
    }

    if (this.actor.type === "prime") {
      this.activateListenersNPC(html);
    }
  }

  private activateListenersPC(html: JQuery) {
    html
      .find(".cowboy-admin-action-health")
      .on("click", this._onDamage.bind(this));

    html
      .find(".cowboy-actor-trait-name")
      .on("change", this._onRenameTrait.bind(this));

    html
      .find(".cowboy-actor-trait-damaged")
      .on("change", this._onDamageTrait.bind(this));

    html
      .find(".cowboy-admin-action-restore")
      .on("click", this._onRestore.bind(this));
  }

  private activateListenersNPC(html: JQuery) {
    html.find(".cowboy-cadrans-add").on("click", this._onAddCadran.bind(this));
    html
      .find(".cowboy-prime-current-target-button")
      .on("click", this._onSetCurrent.bind(this));
    html
      .find(".cowboy-actor-token")
      .on("click", this._onSelectToken.bind(this));
    html
      .find(".cowboy-cadran-action")
      .on("click", this._onCadranAction.bind(this));
    html
      .find(".cowboy-cadran-visible")
      .on("click", this._onCadranVisible.bind(this));
    html
      .find(".cowboy-prime-genre")
      .on("change", this._onSelectGenre.bind(this));
  }

  // ========================================
  // PC Actions
  // ========================================

  // Handle damage
  private async _onDamage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const points = parseInt(
      (event.currentTarget as HTMLElement).getAttribute("data-value") || "0"
    );
    await (this.actor as CowboyBebopActor).updateCartridge(points);
  }

  // Restore Traits
  private async _onRestore(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    await (this.actor as CowboyBebopActor).restoreTraits();
  }

  // Rename Trait
  private async _onRenameTrait(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // Recup all the data from the event
    const name = (event.currentTarget as HTMLInputElement).value;
    const traitId = parseInt(
      (event.currentTarget as HTMLInputElement).dataset.index ?? "0"
    );
    const traitCategoryId = (event.currentTarget as HTMLInputElement).dataset
      .category;

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
  private async _onDamageTrait(event: Event, hyperDamaged: boolean = false) {
    event.preventDefault();
    event.stopPropagation();
    // Recup all the data from the event
    const isDamaged = (event.currentTarget as HTMLInputElement).checked;
    const traitId = parseInt(
      (event.currentTarget as HTMLElement).dataset.index ?? "0"
    );
    const traitCategoryId = (event.currentTarget as HTMLElement).dataset
      .category;

    // Check if the data is valid
    if (traitCategoryId === undefined || traitId === undefined) return;

    // Save the new data
    await (this.actor as CowboyBebopActor).damageTrait(
      traitCategoryId,
      traitId,
      isDamaged,
      hyperDamaged
    );
  }

  // Roll Dice
  private async _onRollDice(event: Event) {
    console.log("Rolling dice");
    event.preventDefault();
    // event.stopPropagation();
    // Recup all the data from the event
    const traitCategoryId = (event.currentTarget as HTMLElement).dataset
      .category;

    // Check if the data is valid
    if (traitCategoryId === undefined) return;

    // Save the new data
    await (this.actor as CowboyBebopActor).prepareDicePool(traitCategoryId);
  }

  //=============================================
  // NPC Actions
  //=============================================

  private _onAddCadran(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const parent = (event.currentTarget as HTMLElement).parentElement;

    const genre = (
      parent
        ?.getElementsByClassName("cowboy-cadrans-select-genre")
        .item(0) as HTMLSelectElement
    ).value;

    const goal = (
      parent
        ?.getElementsByClassName("cowboy-cadrans-select-goal")
        .item(0) as HTMLSelectElement
    ).value;

    const important = (
      parent
        ?.getElementsByClassName("cowboy-cadrans-select-important")
        .item(0) as HTMLSelectElement
    ).value;

    const size = parseInt(
      (event.currentTarget as HTMLElement).dataset.size ?? ""
    );
    (this.actor as CowboyBebopActor).addCadran(
      genre,
      size,
      goal === "true",
      important === "true"
    );
  }

  private _onSetCurrent(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    (this.actor as CowboyBebopActor).setCurrentTarget();
  }

  private _onSelectToken(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const tokenClicked = event.currentTarget as HTMLElement;
    const parent = tokenClicked?.parentElement?.parentElement;
    if (!parent) return;

    this.genreSelected = tokenClicked.dataset.genre;
    this.typeSelected = tokenClicked.dataset.type;

    const elements = Array.from(
      parent.getElementsByClassName("cowboy-actor-token")
    );

    elements.forEach((element: Element) => {
      element.classList.remove("cowboy-actor-token-selected");
    });

    elements
      .filter((element: Element) => element === tokenClicked)
      .forEach((element: Element) => {
        element.classList.add("cowboy-actor-token-selected");
      });
  }

  private async _onCadranAction(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const action = (event.currentTarget as HTMLElement).dataset.action;
    const cadranIndex = parseInt(
      (event.currentTarget as HTMLElement).dataset.index ?? "0"
    );
    let result: boolean = false;

    console.log(event.currentTarget, action, cadranIndex);

    switch (action) {
      case "remove":
        (this.actor as CowboyBebopActor).deleteCadran(cadranIndex);
        break;
      case "increase":
        result = await (this.actor as CowboyBebopActor).increaseCadran(
          cadranIndex,
          this.genreSelected ?? "",
          this.typeSelected ?? ""
        );
        if (!result) {
          ui.notifications?.warn("Impossible d'augmenter ce cadran");
        }
        break;
    }
  }

  private _onCadranVisible(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const cadranIndex = parseInt(
      (event.currentTarget as HTMLElement).dataset.index ?? "0"
    );

    (this.actor as CowboyBebopActor).toggleCadranVisibility(cadranIndex);
  }

  private async _onSelectGenre(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const genre = (event.currentTarget as HTMLInputElement).value;

    await (this.actor as CowboyBebopActor).setGenre(genre ?? "");
  }
}
