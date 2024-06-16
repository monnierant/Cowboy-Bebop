import CowboyBebopActor from "../documents/cowboybebopActor";
import { moduleId, rangs } from "../../constants";

export default class CowboyBebopRollDialog extends Dialog {
  // ========================================
  // Constructor
  // ========================================
  constructor(
    genre: string,
    category: string,
    actor: CowboyBebopActor,
    dicePool: string[],
    options: any = {},
    data: any = {}
  ) {
    // Call the parent constructor

    const _options = {
      ...options,
      ...{
        title: "Roll Dice Pool",
        buttons: {
          rollButton: {
            label: "Roll",
            callback: (html: JQuery) => {
              console.log("Roll");
              this._onRoll(html);
            },
            icon: '<i class="fas fa-dice"></i>',
          },
          cancelButton: {
            label: "Cancel",
            icon: '<i class="fa-solid fa-ban"></i>',
          },
        },
      },
    };
    console.log(_options);

    super(_options, data);

    // Set the actor
    this.actor = actor;
    this.genre = genre;
    this.category = category;

    this.dicePool = dicePool;
  }

  // ========================================
  // Properties
  // ========================================
  public actor: CowboyBebopActor;
  public dicePool: string[];
  public genre: string;
  public category: string;

  // Define the template to use for this sheet
  override get template() {
    return `systems/${moduleId}/templates/dialog/roll.hbs`;
  }

  // Data to be passed to the template when rendering
  override getData() {
    let data: any = super.getData();
    data.isGM = (game as Game).user?.isGM;
    data.actor = this.actor;
    data.dicePool = this.dicePool;
    data.genre = this.genre;
    data.category = this.category;
    data.rangs = rangs;
    return data;
  }

  // ========================================
  // Actions
  // ========================================
  // Roll the dice
  private async _onRoll(html: JQuery) {
    // Roll the dice
    const rang = parseInt(html.find(".cowboy-dialog-rang").val() as string);
    const mouvement = rangs[rang ?? 0];
    const advantage =
      parseInt(
        html.find(".cowboy-dialog-modifier-advantage").val() as string
      ) ?? 0;
    const traitsUsed = html
      .find(".cowboy-dialog-dice-pool > input[type='checkbox']:checked")
      .toArray();
    const bonus = this.genre === this.category ? 1 : 0;

    const advantageInstruction = ["dh", "", "dl"];

    const diceOptions = {
      nb: mouvement.dices + traitsUsed.length + Math.abs(advantage) + bonus,
      advantage: advantageInstruction[advantage + 1],
    };

    let roll = new Roll(`${diceOptions.nb}d6${diceOptions.advantage}`);
    const result = await roll.roll();

    console.log(traitsUsed);
    console.log(roll);

    // const content = await result.render({
    //   template: `systems/${moduleId}/templates/chat/roll-troubleshoot.hbs`,
    // });
    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/roll.hbs`,
      {
        actor: this.actor,
        genre: this.genre,
        category: this.category,
        rang: rang,
        mouvement: mouvement,
        advantage: advantage,
        bonus: bonus,
        traitsUsed: traitsUsed.map((trait) => trait.dataset.dice),
        result: result,
      }
    );

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
    });
  }
}
