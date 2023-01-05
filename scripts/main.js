
import { Core } from './utils/core.js';
import { Lighting } from './utils/lighting.js';
import { Effects } from './utils/effects.js';

// ******************************************
// Globals
// ******************************************
let inProgressLight = false;
let moduleState = false;

// ******************************************
// Hooks
// ******************************************
Hooks.once('init', () => {
  // Create a socket event handler to listen to incomming sockets and dispatch to callbacks
  game.socket.on(`module.tokenlightcondition`, (data) => {
  });
});

Hooks.once('ready', () => {
  const module = game.modules.get('tokenlightcondition');
  const moduleVersion = module.version;
  console.log(`tokenlightcondition | Ready ${moduleVersion}`);
  moduleState = true;

  Effects.initializeEffects();
});

Hooks.on('lightingRefresh', (data) => {
  if (game.user.isGM) {
    processLightingRefresh();
  }
});

Hooks.on('refreshToken', (token) => {
  if (moduleState) {
    if (game.user.isGM) {
      Core.isValidActor(token);
    }
  }
})

Hooks.on('renderTokenHUD', (tokenHUD, html, app) => {
  const showHud = game.settings.get('tokenlightcondition', 'showTokenHud');
  if (showHud) {
    let selected_token = Core.find_selected_token(tokenHUD);
    if (Core.isValidActor(selected_token)) {
      if (game.user.isGM) {
        show_gm_tokenhud(selected_token, tokenHUD,html);
      } else {
        show_player_tokenhud(selected_token, tokenHUD,html);
      }
    }
  }
});

Hooks.on('renderSettingsConfig', (app, html, data) => {
  $('<div>').addClass('form-group group-header').html(game.i18n.localize('tokenlightcond-config-debug')).insertBefore($('[name="tokenlightcondition.logLevel"]').parents('div.form-group:first'));
  $('<div>').addClass('form-group group-header').html(game.i18n.localize('tokenlightcond-config-general')).insertBefore($('[name="tokenlightcondition.showTokenHud"]').parents('div.form-group:first'));
});

// ******************************************
// Functions
// ******************************************

async function processLightingRefresh() {
  if (!inProgressLight) {
    inProgressLight = true;
    await Lighting.check_all_tokens_lightingRefresh();
    inProgressLight = false;
  } else {
    // process is already underway...
    // Core.log("lightingRefresh Busy");
  }
}

function show_gm_tokenhud(selected_token, tokenHUD,html) {
  Lighting.show_lightLevel_box(selected_token, tokenHUD,html);
}

function show_player_tokenhud(selected_token, tokenHUD,html) {
  Lighting.show_lightLevel_player_box(selected_token, tokenHUD,html);
}
