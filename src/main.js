import { setupInput } from './input.js';
import { Game } from './game.js';

const canvas = document.getElementById('game');

setupInput();

const game = new Game(canvas);

window.addEventListener('resize', () => game.resize());

game.loop();
