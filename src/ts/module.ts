// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/style.scss";

// import DogBrowser from "./apps/dogBrowser";
import CowboyBebopItemSheet from "./apps/sheets/cowboybebopItemSheet";
import CowboyBebopActorSheet from "./apps/sheets/cowboybebopActorSheet";
import CowboyBebopActor from "./apps/documents/cowboybebopActor";
import { colors, moduleId } from "./constants";
import { Cadran } from "./types";
import { range } from "./handlebarsHelpers/range";
import { genreToIcon } from "./handlebarsHelpers/genreToIcon";
// import CowboyBebopRoll from "./apps/rolls/cowboybebopRoll";
// import CowboyBebopResultRollMessageData from "./apps/messages/cowboybebopResultRollMessageData";

async function preloadTemplates(): Promise<any> {
  const templatePaths = [
    `systems/${moduleId}/templates/partials/rythm-counter.hbs`,
    `systems/${moduleId}/templates/partials/health-counter.hbs`,
    `systems/${moduleId}/templates/partials/actor-admin-panel.hbs`,
    `systems/${moduleId}/templates/partials/cadran-counter.hbs`,
    `systems/${moduleId}/templates/partials/token-counter.hbs`,
  ];

  return loadTemplates(templatePaths);
}

Hooks.once("init", () => {
  console.log(`Initializing ${moduleId}`);

  Handlebars.registerHelper("range", range);
  Handlebars.registerHelper("genreToIcon", genreToIcon);

  Handlebars.registerHelper(
    "circlePortion",
    function (index: number, total: number, radius: number) {
      return index * (radius / total);
    }
  );

  Handlebars.registerHelper("divide", function (a: number, b: number) {
    return a / b;
  });

  Handlebars.registerHelper("coloron", function (cadran: Cadran) {
    return colors[cadran.genre]?.on;
  });

  Handlebars.registerHelper("coloroff", function (cadran: Cadran) {
    return colors[cadran.genre]?.off;
  });

  CONFIG.Actor.documentClass = CowboyBebopActor;
  // CONFIG.ChatMessage.dataModels.rollMessage = CowboyBebopResultRollMessageData;

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(moduleId, CowboyBebopItemSheet, { makeDefault: true });

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(moduleId, CowboyBebopActorSheet, { makeDefault: true });

  preloadTemplates();
});

Hooks.on(
  "renderChatMessage",
  (app: Application, html: JQuery, data: any): void => {
    console.log("renderChatMessageHook");
    html.find(".cowboy-roll-action").on("click", (event: Event) => {
      const datas = (event.currentTarget as HTMLElement).dataset;
      const actor: CowboyBebopActor = (game as any).actors?.get(datas.actorId);
      const target: CowboyBebopActor | undefined = (
        (game as any).actors as Array<CowboyBebopActor>
      )?.find(
        (actor: CowboyBebopActor) => (actor as any).system.isCurrentTarget
      );
      switch (datas.action) {
        case "damage-cartridge":
          actor?.actionDamageCartridge(
            html,
            event.currentTarget as HTMLInputElement,
            parseInt(datas.rollid ?? "0")
          );
          break;
        case "damage-trait":
          actor?.actionDamageTrait(
            html,
            event.currentTarget as HTMLInputElement,
            parseInt(datas.rollid ?? "0"),
            datas.category ?? "",
            datas.trait ?? ""
          );
          break;
        case "hyper-damage-trait":
          actor?.actionHyperDamageTrait(
            html,
            event.currentTarget as HTMLInputElement,
            parseInt(datas.rollid ?? "0"),
            datas.category ?? "",
            datas.trait ?? ""
          );
          break;
        case "collect":
          console.log(
            datas.genre ?? "",
            parseInt(datas.cartons ?? "0"),
            parseInt(datas.notes ?? "0")
          );
          actor?.actionRemoveRoll(
            html,
            event.currentTarget as HTMLInputElement,
            parseInt(datas.rollid ?? "0")
          );
          target?.actionCollectCarton(
            datas.genre ?? "",
            parseInt(datas.cartons ?? "0"),
            parseInt(datas.notes ?? "0")
          );
      }
    });

    if (!app) return;
    if (!data) return;
  }
);
