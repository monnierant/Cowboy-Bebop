import { moduleId } from "../../constants";

export default class CowboyBebopItemSheet extends ItemSheet {
  override get template() {
    return `systems/${moduleId}/templates/sheets/item/item-sheet-${this.item.type}.hbs`;
  }
}
