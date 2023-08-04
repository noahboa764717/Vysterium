/* eslint-env browser */
/* global __uv$config __stomp$config */

import Logger from './scripts/logger.js';
import { registerSettings, useCustomCSS, sleep } from './scripts/utilities.js';
import { config } from './scripts/managers.js';

import FlowInstance from './flow.js';

import '/script/uv.config.js';

window.immortalize = async () => {
	console.log('Loading 3MB Tailwind Package...');
	await sleep(500);
	console.log('Immortalizing OS...');
	await sleep(200);
	console.log('Rebooting...');
	await config.settings.set('theme', {'url':'/flowos/builtin/themes/immortal.css'});
	await sleep(200);
	window.location.reload();
};

self.Flow = new FlowInstance();
self.logger = new Logger();

window.onload = () => {
	registerSettings();

	useCustomCSS();

	window.Flow.boot();
};