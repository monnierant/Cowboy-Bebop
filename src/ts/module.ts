// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/style.scss";

// import DogBrowser from "./apps/dogBrowser";
import CowboyBebopItemSheet from "./apps/sheets/cowboybebopItemSheet";
import CowboyBebopActorSheet from "./apps/sheets/cowboybebopActorSheet";
import CowboyBebopActor from "./apps/documents/cowboybebopActor";
import { moduleId } from "./constants";
import { MyModule } from "./types";

let module: MyModule;

async function preloadTemplates(): Promise<any> {
  const templatePaths = [
    `systems/${moduleId}/templates/partials/rythm-counter.hbs`,
    `systems/${moduleId}/templates/partials/health-counter.hbs`,
  ];

  return loadTemplates(templatePaths);
}

Hooks.once("init", () => {
  console.log(`Initializing ${moduleId}`);

  Handlebars.registerHelper(
    "range",
    function (start: number, end: number, context: any, options: any) {
      let result = "";
      for (let i = start; i <= end; i++) {
        result += options.fn({ ...context, index: i });
      }
      return result;
    }
  );

  CONFIG.Actor.documentClass = CowboyBebopActor;

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(moduleId, CowboyBebopItemSheet, { makeDefault: true });

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(moduleId, CowboyBebopActorSheet, { makeDefault: true });

  preloadTemplates();
});

Hooks.on("renderActorDirectory", (_: Application, html: JQuery) => {
  const button = $(
    `<button class="cc-sidebar-button" type="button">🐶</button>`
  );
  button.on("click", () => {
    module.dogBrowser.render(true);
  });
  html.find(".directory-header .action-buttons").append(button);
});

// Hooks.on("renderChatLog", (app: any, html: any, data: any): any => {
//   documents.Item5e.chatListeners(html);
//   documents.ChatMessage5e.onRenderChatLog(html);
// });
Hooks.on(
  "renderChatMessage",
  (app: Application, html: JQuery, data: any): void => {
    console.log("renderChatMessageHook");
    html.find(".cowboy-roll-action").on("click", (event: Event) => {
      console.log("renderChatMessageHookClick");
      console.log(event.currentTarget);
      const datas = (event.currentTarget as HTMLElement).dataset;
      const actor: CowboyBebopActor = (game as any).actors?.get(datas.actorId);
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
        case "collect":
          //TODO: implement collect
          console.log("collect TODO");
          break;
      }
    });

    if (!app) return;
    if (!data) return;
  }
);
