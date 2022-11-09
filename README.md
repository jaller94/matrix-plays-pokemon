# Matrix Plays Pokémon
Similar to [Twitch Plays Pokémon](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon) this lets the members of a Matrix chat room control an mGBA emulator.

## Features

* Write A, B, Up, Left, Right, Down, Start or Select into the chat for the button to be pressed.
* Write screenshot into the chat to receive a screenshot.
* It's not limited to Pokémon games. All GameBoy and GameBoy Advance games can be controlled.
  * For the supported Pokémon games, the party information (names, levels, HP) is send to Matrix.
* There's no limit on how many Matrix users can control the emulator at once.
* Currently, only "anarchy" mode is implemented. Everyone's input gets pressed.
* The GameBoy Advance's sholder buttons L and R aren't implemented.

## Pokémon ROMs with party info support

* Pokémon Red, Blue, Yellow (US)
* Pokémon Gold, Silver, Crystal (US)
* Pokémon Ruby, Saphir (US)

## Requirements

* mGBA 0.10.0 or newer
  * Must support Lua scripts
* NodeJS

## Setup

1. Rename `config.sample.json` to `config.json` and edit it with a text editor.
2. Run `cd matrix-bot && npm install && cd -` to install code dependencies.

## Run it

1. Launch mGBA and load a Pokémon ROM.
2. Load the lua script.
3. Launch the Matrix bot: `npm run start`

## License

MLP-2.0 to match the license of mGBA.
