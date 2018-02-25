```
/*
 ██████   █████  ███    ██ ███    ██ ███████ ██████
 ██   ██ ██   ██ ████   ██ ████   ██ ██      ██   ██
 ██████  ███████ ██ ██  ██ ██ ██  ██ █████   ██████
 ██   ██ ██   ██ ██  ██ ██ ██  ██ ██ ██      ██   ██
 ██████  ██   ██ ██   ████ ██   ████ ███████ ██   ██

  ██████  ██████  ███    ███ ███    ███ ███████ ███    ██ ████████ ███████
 ██      ██    ██ ████  ████ ████  ████ ██      ████   ██    ██    ██            ██
 ██      ██    ██ ██ ████ ██ ██ ████ ██ █████   ██ ██  ██    ██    ███████     ██████
 ██      ██    ██ ██  ██  ██ ██  ██  ██ ██      ██  ██ ██    ██         ██       ██
  ██████  ██████  ██      ██ ██      ██ ███████ ██   ████    ██    ███████
*/
      credits: lunar_limbo, original author: IMFUZZ
```
Organize your code with large ASCII font comments to quickly idenfity your position in the file.

Deeply `customize` the output with prefix, suffix, perLinePrefix, and more. Use `commands` or `stored configs` to quickly add large banner comments using [figlet](https://www.npmjs.com/package/figlet). With [geddski.macros](https://marketplace.visualstudio.com/items?itemName=geddski.macros) you can setup `keybinds` for your favorite configs

Play around with **over 275+** _mostly_ useless ascii fonts in this [sandbox](http://patorjk.com/software/taag/).

**NEW!** Is your favorite figlet missing? No problem! Add your own .flf fonts for use with this extension. Create your own or download from the many sources online


# Features

- Will convert selection(s) or current line(s) into banner
- Use a default configuration or create multiple saved configs
- Setup keybinds for your favorite configs using [geddski.macros](https://marketplace.visualstudio.com/items?itemName=geddski.macros) ([instructions below](#macro-configuration))
- Deep customization: from Figlet's options, to comment styles, and even prefixes/suffixes
- Add your own fonts to the available list

## Examples

### i3 configuration

![example: i3 config](images/i3Config.gif)  

### vscode extension

![example: vscode extension](images/extension.gif)  



# Commands

## Apply - Converts selection or line into banner comment

![feature 'Apply'](images/apply.gif)


## ApplyFromConfig - Convert selection or line using stored config

![feature 'ApplyFromConfig'](images/applyFromConfig.gif)


## Keybinds for configs - Apply configs with keybinds using [geddski.macros](https://marketplace.visualstudio.com/items?itemName=geddski.macros)

![feature 'Apply Config with Keybind'](images/keybinds.gif)

## Supports multiple selections

![feature 'Multiple Selections'](images/multi-selection.gif)


**see contributions for other commands** 

## Extension Settings

### Figlet Settings

The figlet settings can be best understood by playing with [this tool](http://patorjk.com/software/taag/)

- `font`
- `horizontalLayout`
- `verticalLayout`

### Trim Settings

- `trimTrailingWhitespace`
  - to avoid lint traps
- `trimEmptyLines`
  - often, fonts have extra lines for descenders even when none in output
  - get rid of them to clean up your result
  - OR don't and keep each output unfirom
  - NOTE: will remove ALL lines. Multi line banners will therefore ignore verticalLayout

### Comment Style

Some languages don't have both styles of comments. Some langauges have different standards for how to use those comment styles. Take your pick.

- `block`: only use block style comment, but fallback to line comment if none
- `line`: only use line style comment, but fallback to block comment if none
- `both`: always put both block and line comments in output

### Fix Settings

These are rather straight forward. But remember these caveats:

1. perLinePrefix is applied to your prefix and suffix
2. Use \n to add newlines
3. perLinePrefix applied even without commentStyle line added

- `prefix`
- `suffix`
- `perLinePrefix`

# Macro configuration

1. install geddski.macros
2. write configs in settings file
3. write macro for config in settings file
4. create keybind

## 2. Write config

``` json
    "banner-comments-plus.configs": {
        "h1": {
            "font": "Small",
            "trimEmptyLines": true,
            "commentStyle": "block",
            "prefix": "",
            "suffix": "--------------------------------------------------"
        }
    }
```

## 3. Write macro

The `args` value MUST match the `key` given to the config in your settings.

``` json
     "macros": {
        "banner-comments-plus-h1": [
            {"command": "banner-comments-plus.ApplyFromConfig", "args": "h1"},
        ]
    }
```

## 4. Create Keybind

``` json
    {
        "key": "ctrl+shift+delete",
        "command": "macros.banner-comments-plus-h1",
        "when": "editorTextFocus"
    }
```

# Requirements

None!

# Known Issues

- ~~Only the languages provided by vscode are supported to wrap the banner with comments.~~
- ~~Does not work with Markdown because of naming convention of extension from Microsoft~~
- Adding a config through menus, you cannot set prefix, suffix, or perLineSuffix to double apostraphe ('') as this value is reserved to sumbit an empty string
-----------------------------------------------------------------------------------------------------------


<style>
    img { border: 1px dashed #666;}
    h3 + p { margin-left: 1rem;}
    #i3-configuration + p,
    #vscode-extension + p
     {
        display:flex;
        align-items: center;
        flex-wrap:wrap;
        flex:0 1 20%;
    }
    #i3-configuration + p img,
    #vscode-extension + p img {
        height: 250px;
        margin: 0 1rem 0rem 0;
    }
</style>