import { genres } from "../../constants";
import { Trait, Traits } from "../../types";
import CowboyBebopRollDialog from "../dialog/cowboybebopRollDialog";
import CowboyBebopRoll from "../rolls/cowboybebopRoll";

export default class CowboyBebopActor extends Actor {
  private _rolls: CowboyBebopRoll[] = [];

  //=============================================================================
  // PC
  //=============================================================================

  // ========================================
  // Roll
  // ========================================
  public async roll(
    genre: string,
    category: string,
    rang: any,
    mouvement: any,
    advantage: number,
    traitsUsed: any
  ) {
    const roll = new CowboyBebopRoll(
      this._rolls.length,
      this,
      genre,
      category,
      rang,
      mouvement,
      advantage,
      traitsUsed
    );
    this._rolls.push(roll);
    await roll.roll();
    await roll.toMessage();
  }

  // ========================================
  // Actions
  // ========================================

  public async restoreTraits() {
    await this.update({
      "system.traits": this.restoreTraitImut((this as any).system.traits),
    });
  }

  public async actionDamageCartridge(
    html: JQuery,
    element: HTMLInputElement,
    rollId: number
  ) {
    await this.updateCartridge(-1);
    this._rolls[rollId].actionRemoveNote();
    this.removeMessage(html, element);
  }

  public async actionDamageTrait(
    html: JQuery,
    element: HTMLInputElement,
    rollId: number,
    category: string,
    traitToDamage: string
  ) {
    const index = (this as any).system.traits[category].findIndex(
      (trait: Trait) => trait.name === traitToDamage
    );

    this.damageTrait(category, index, true, false);
    this._rolls[rollId].actionRemoveNoteByTrait(traitToDamage);
    this.removeMessage(html, element);
  }

  public async actionCollectCarton(
    html: JQuery,
    element: HTMLInputElement,
    rollId: number,
    cartons: number
  ) {
    await this.update({
      "system.cartons": (this as any).system.cartons + cartons,
    });
    this._rolls[rollId].deletePreviousMessage();
    this.removeMessage(html, element);
  }

  public async actionHyperDamageTrait(
    html: JQuery,
    element: HTMLInputElement,
    rollId: number,
    category: string,
    traitToDamage: string
  ) {
    const index = (this as any).system.traits[category].findIndex(
      (trait: Trait) => trait.name === traitToDamage
    );

    await this._rolls[rollId].reRoll(traitToDamage);
    this.damageTrait(
      category,
      index,
      true,
      this._rolls[rollId].getCarton() < 2
    );
    this._rolls[rollId].toMessage();
    this.removeMessage(html, element);
  }

  public removeMessage(html: JQuery, element: HTMLInputElement) {
    const parent = html.find(element).parents("li.chat-message");

    parent.remove();
  }

  // ========================================
  // Preparation
  // ========================================
  // Dice Pool
  public prepareDicePool(category: string) {
    // Get the traits
    const traits = (this as any).system.traits[category];
    // Get the dice pool
    const dicePool = traits
      .filter((trait: Trait) => !trait.damaged)
      .filter((trait: Trait) => trait.name != "")
      .map((trait: Trait) => trait.name);

    const dialog = new CowboyBebopRollDialog("rock", category, this, dicePool);

    dialog.render(true);
    console.log("dialogOpened");
  }

  // ========================================
  // Update
  // ========================================
  // Damage Cartridge
  public async updateCartridge(points: number) {
    // Save the new data
    await this.update({
      "system.cartridge": (this as any).system.cartridge + points,
    });
  }

  // Rename Trait
  public async renameTrait(category: string, index: number, newName: string) {
    // Save the new data
    await this.update({
      "system.traits": this.renameTraitImut(
        (this as any).system.traits,
        category,
        index,
        newName
      ),
    });
  }

  // Damaged Trait
  public async damageTrait(
    category: string,
    index: number,
    newDamaged: boolean,
    hyperDamaged: boolean = false
  ) {
    // Save the new data
    await this.update({
      "system.traits": this.damageTraitImut(
        (this as any).system.traits,
        category,
        index,
        newDamaged,
        hyperDamaged
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
    newDamaged: boolean,
    newHyperDamaged: boolean = false
  ): Traits {
    if (traits[category] && traits[category][index]) {
      return {
        ...traits,
        [category]: traits[category].map((trait: Trait, i: number) =>
          i === index
            ? { ...trait, damaged: newDamaged, hyperdamaged: newHyperDamaged }
            : trait
        ),
      };
    } else {
      console.error("Trait or category not found");
      return traits;
    }
  }

  private restoreTraitImut(traits: Traits): any {
    let result: Traits = new Object() as Traits;

    genres.forEach((category: string) => {
      result[category] = traits[category].map((trait: Trait) => {
        return { ...trait, damaged: false, hyperdamaged: false };
      });
    });

    return result;
  }

  //=============================================================================
  // NPC
  //=============================================================================
}
