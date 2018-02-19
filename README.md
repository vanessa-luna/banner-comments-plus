```
  ____                                                       
 |  _ \                                                      
 | |_) | __ _ _ __  _ __   ___ _ __                          
 |  _ < / _` | '_ \| '_ \ / _ \ '__|                         
 | |_) | (_| | | | | | | |  __/ |                            
 |____/_\__,_|_| |_|_| |_|\___|_|            _               
  / ____|                                   | |          _   
 | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ ___   _| |_ 
 | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __/ __| |_   _|
 | |___| (_) | | | | | | | | | | |  __/ | | | |_\__ \   |_|  
  \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|___/        
```


Figlet Font Code Comments.

Use quick commands or stored configs to quickly add large banner comments using [figlet](https://www.npmjs.com/package/figlet). 

Play around with **over 275+** _mostly_ useless ascii fonts in this [sandbox](http://patorjk.com/software/taag/)



# Features

- Will convert selection or current line into banner
- Use a default configuration or create multiple saved configs
- Setup keybinds for your favorite configs using [geddski/macros](https://marketplace.visualstudio.com/items?itemName=geddski.macros) ([instructions below](#macro-configuration))

## Commands

- **"Apply"**: Converts selectoin or line into banner comment

    ![feature 'Apply'](images/apply.gif)

- **"ApplyFromConfig"**: Convert selection or line using stored config

    ![feature 'ApplyFromConfig'](images/applyFromConfig.gif)

- Apply configs with keybinds using geddski/macros

    ![feature 'Apply Config with Keybind'](images/keybinds.gif)

- Supports multiple selections:

    ![feature 'Multiple Selections'](images/multi-selection.gif)

- **ApplyFromList** - select font before applying default config
- **ApplyFromFavorites** - select favorite font before applying default config
- **SetDefaultFont"** - set the default font from full list of fonts
- **SetDefaultFontFromFavorites"** - set the default font from favorites list
- **AddFontToFavorites"** - add a font to the favorites list
- **AddCurrentFontToFavorites"** - add current default font to favorites list
- **RemoveFontFromFavorites** - remove a font from favorites list

## Extension Settings

* `banner-comments-plus.font`: **<string\>** (name of Figlet font)
* `banner-comments-plus.horizontalLayout`: **<string\>** ['default', full', 'fitted', 'controlled smushing', 'universal smushing']
* `banner-comments-plus.verticalLayout`: **<string\>** ['default', full', 'fitted', 'controlled smushing', 'universal smushing']
* `banner-comments-plus.trimTrailingWhitespace`: **<boolean\>** remove excess spaces at end of line?
* `banner-comments-plus.trimEmptyLines`: **<boolean\>** remove lines with only spaces?
* `banner-comments-plus.prefix`: **<string\>** string to place at beginning of result
* `banner-comments-plus.suffix`: **<string\>** string to place at end of result
* `banner-comments-plus.perLinePrefix`: **<string\>** string to place at beginning of each line
* `banner-comments-plus.configs`: **<object\>** object with named configs (all other settings combine to create one config)


# Macro configuration

1. install geddski/macros
2. write configs in settings file
3. write macro for config in settings file
4. create keybind


### 2. Write config(s)

**User Settings**
``` json
    "banner-comments-plus.configs": {
        "h1": {
            "font": "Small",
            "horizontalLayout": "default",
            "verticalLayout": "default",
            "trimTrailingWhitespace": false,
            "trimEmptyLines": true,
            "perLinePrefix": " ",
            "prefix": "",
            "suffix": "--------------------------------------------------"
        }
    }
```

### 3. Write macro

**User Settings**

The `args` value MUST match the `key` given to the config in your settings.

``` json
     "macros": {
        "banner-comments-plus-h1": [
            {"command": "banner-comments-plus.ApplyFromConfig", "args": "h1"},
        ]
    }
```

### 4. Create Keybind

**User Keybinds**
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

- Only the languages provided by vscode are supported to wrap the banner with comments.

-----------------------------------------------------------------------------------------------------------