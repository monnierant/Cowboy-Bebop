import { Trait, Traits } from "../../types";

export default class CowboyBebopActor extends Actor {
  // ========================================
  // Update
  // ========================================
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
    newDamaged: boolean
  ) {
    // Save the new data
    await this.update({
      "system.traits": this.damageTraitImut(
        (this as any).system.traits,
        category,
        index,
        newDamaged
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
