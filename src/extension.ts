'use strict';
import * as vscode from 'vscode';
import * as figlet from 'figlet'; 
import * as fs from 'fs';
import * as path from 'path';
import * as commentJson from 'comment-json';
import * as async from 'async';

// String for accessing settings in getConfiguration
const BCP_CONFIG_NS:string = "banner-comments-plus"


/* 
    PUBLIC API
*/
/* apply using defaults in settings */
function apply () {
    const editor:vscode.TextEditor = vscode.window.activeTextEditor;
    var config = getDefaultConfig(editor.document.languageId);
    applyToEditor(editor, config);
}
/* apply default config after picking font from full list */
function applyFromList () {
    var availableFigletfonts:string[] = figlet.fontsSync();
    var items:vscode.QuickPickItem[] = availableFigletfonts.map(
        (figletFont:string) => {
            return { label: figletFont, description: "Use the " + figletFont + " font" };
        }
    );
    vscode.window.showQuickPick(items).then(
        (_selectedPickerItem:vscode.QuickPickItem) => {
            if (!_selectedPickerItem) return;
            const editor:vscode.TextEditor = vscode.window.activeTextEditor;
            var config = getDefaultConfig(editor.document.languageId);
            config.figletConfig.font = _selectedPickerItem.label;
            applyToEditor(editor, config);
        }
    );
}
/* apply after picking font from favorites */
function applyFavorite () {
    let favoriteFonts:string[] = vscode.workspace.getConfiguration(BCP_CONFIG_NS).get("favorites");
    var items:vscode.QuickPickItem[] = favoriteFonts.map(
        (_favoriteFont:string) => {
            return { label: _favoriteFont, description: "Use the " + _favoriteFont + " font" };
        }
    );
    vscode.window.showQuickPick(items).then(
        (_selectedPickerItem:vscode.QuickPickItem) => {
            if (!_selectedPickerItem) return;
            const editor:vscode.TextEditor = vscode.window.activeTextEditor;
            var config = getDefaultConfig(editor.document.languageId);
            config.figletConfig.font = _selectedPickerItem.label;
            applyToEditor(editor, config);
        }
    );
}
/* apply after picking config from settings */
function applyFromConfig () {
    const editor:vscode.TextEditor = vscode.window.activeTextEditor;
    var bcpConfig = vscode.workspace.getConfiguration(BCP_CONFIG_NS);
    let configs:object = bcpConfig.get("configs");
    let descriptionKeys:string[] = bcpConfig.get("configDescriptionKeys");
    var items:vscode.QuickPickItem[] = []
    for (let key in configs) {
        let curConfig:any = configs[key];
        let description:string = "font:" + configs[key].font;
        if (!!descriptionKeys && descriptionKeys.length) {
            description = ""
            for (let decsKey of descriptionKeys) {
                description += decsKey + ": " + curConfig[decsKey] + " | ";
            }
        }
        items.push({ label: key, description: description });
    }
    vscode.window.showQuickPick(items).then(
        (_selectedPickerItem:vscode.QuickPickItem) => {
            if (!_selectedPickerItem) return;
            var config = configs[_selectedPickerItem.label]
            config.languageId = editor.document.languageId;
            applyToEditor(editor, formatConfigFromSettings(config))
        }
    );
}
/* use geddski/macros to call configs from shortcuts */
function applyDirectFromConfig(args:any) {
    if (!args) return vscode.window.showErrorMessage("BannerComments+: Run Direct From Config using geddski/macros ONLY")
    let name = args.name;
    const editor:vscode.TextEditor = vscode.window.activeTextEditor;
    let configs:object = vscode.workspace.getConfiguration(BCP_CONFIG_NS).get("configs");
    let config = configs[name];
    if(config) {
        config.languageId = editor.document.languageId;
        applyToEditor(editor, formatConfigFromSettings(config));
    } else {
        vscode.window.showErrorMessage("BannerComments+: no config found with name " + name);
    }
}
/* change default font */
function setDefaultFont() {
    var availableFigletfonts:string[] = figlet.fontsSync();
    var items:vscode.QuickPickItem[] = availableFigletfonts.map(
        (figletFont:string) => {
            return { label: figletFont, description: "Use the " + figletFont + " font" };
        }
    );
    vscode.window.showQuickPick(items).then(
        (_selectedPickerItem:vscode.QuickPickItem) => {
            if (!_selectedPickerItem) return;
            let bcpConfig:any = vscode.workspace.getConfiguration(BCP_CONFIG_NS);
            bcpConfig.update('font', _selectedPickerItem.label, true);
        }
    );
}
/* change default font picking from favorites list */
function setDefaultFontFromFavorites () {
    let bcpConfig:any = vscode.workspace.getConfiguration(BCP_CONFIG_NS);
    let favoriteFonts:string[] = bcpConfig.get("favorites");
    var items:vscode.QuickPickItem[] = favoriteFonts.map(
        (_favoriteFont:string) => {
            return { label: _favoriteFont, description: "Use the " + _favoriteFont + " font" };
        }
    );
    vscode.window.showQuickPick(items).then(
        (_selectedPickerItem:vscode.QuickPickItem) => {
            if (!_selectedPickerItem) return;
            let fontToSetName:string = _selectedPickerItem.label;
            bcpConfig.update('font', fontToSetName, true);
        }
    );
}
/* add a font to favorites list */
function addFontToFavorites () {
    var availableFigletfonts:string[] = figlet.fontsSync();
    var items:vscode.QuickPickItem[] = availableFigletfonts.map(
        (figletFont:string) => {
            return { label: figletFont, description: "Use the " + figletFont + " font" };
        }
    );
    vscode.window.showQuickPick(items).then(
        (_selectedPickerItem:vscode.QuickPickItem) => {
            if (!_selectedPickerItem) return;
            let bcpConfig:any = vscode.workspace.getConfiguration(BCP_CONFIG_NS);
            let favoriteFonts:string[] = bcpConfig.get("favorites");
            let fontToAddName:string = _selectedPickerItem.label;
            if (!favoriteFonts.includes(fontToAddName)) {
                favoriteFonts.push(fontToAddName);
                bcpConfig.update('favorites', favoriteFonts, true);
            } else {
                vscode.window.showInformationMessage("BetterComments+: Chosen font '"+fontToAddName+"' already in favorites.");
            }
        }
    );
}
/* add current default font to favorites list */
function addCurrentFontToFavorites () {
    let bcpConfig:any = vscode.workspace.getConfiguration(BCP_CONFIG_NS);
    let currentFont:string = bcpConfig.get("font");
    let favoriteFonts:string[] = bcpConfig.get("favorites");
    if (!favoriteFonts.includes(currentFont)) {
        favoriteFonts.push(currentFont);
        bcpConfig.update('favorites', favoriteFonts, true);
    } else {
        vscode.window.showInformationMessage("BetterComments+: Current font '"+currentFont+"' is already in favorites.");
    }
}
/* removed font from favorites list */
function removeFromFavorites () {
    let bcpConfig:any = vscode.workspace.getConfiguration(BCP_CONFIG_NS);
    let favoriteFonts:string[] = bcpConfig.get("favorites");
    if (!favoriteFonts || !favoriteFonts.length) {
        vscode.window.showInformationMessage("BannerComments+: No fonts in favorites list");
        return;
    }
    let items:vscode.QuickPickItem[] = favoriteFonts.map(
        (_favoriteFont:string) => {
            return { label: _favoriteFont, description: "Remove " + _favoriteFont + " from favorites." };
        }
    );
    vscode.window.showQuickPick(items).then(
        (_selectedPickerItem:vscode.QuickPickItem) => {
            if (!_selectedPickerItem) return;
            let fontToRemoveName:string = _selectedPickerItem.label;
            let fontToRemoveIndex:number = favoriteFonts.indexOf(fontToRemoveName);
            favoriteFonts.splice(fontToRemoveIndex, 1);
            bcpConfig.update('favorites', favoriteFonts, true);
        }
    );
}





/*
    LOGICS
*/
/* given an editor and config, make a banner! */
function applyToEditor (editor:vscode.TextEditor, config) {
    return editor.edit(
        (builder:vscode.TextEditorEdit) => {
            editor.selections.forEach(
                _selection => applyToDocumentSelection (editor.document, builder, _selection, config)
            );
        }
    );
}
/* replace selection or line using config */
function applyToDocumentSelection (document:vscode.TextDocument, builder:vscode.TextEditorEdit, selection:vscode.Selection, config) {
    var text:string
    if (selection.active.character == selection.anchor.character) {
        var selectionIsLine:vscode.TextLine = document.lineAt(selection.active);
        text = document.getText(selectionIsLine.range);
    } else {
        text = document.getText(selection);
    }
    var bannerText = generateBannerComment(text, config);
    if (selectionIsLine) {
        builder.delete(selectionIsLine.range);
        builder.insert(selectionIsLine.range.start, bannerText)
    } else {
        builder.replace(selection, bannerText);
    }
}
/* generate the banner text given the configs */
function generateBannerComment (inputText:string, config:any) {
    var err:Error;
    var bannerText:string = "";
    var figletConfig = config.figletConfig
    var commentConfig = config.commentConfig
    var options = config.options
    try {
        var figletText:string = figlet.textSync(inputText, figletConfig);
        
        var useBlockComment = (!!commentConfig && commentConfig.blockComment);

        if (useBlockComment) bannerText += commentConfig.blockComment[0] + "\n";
        if (options.prefix) figletText = options.prefix + "\n" + figletText
        if (options.suffix) figletText += "\n" + options.suffix + "\n"
        for (let _line of figletText.split("\n")) {
            if (options.trimEmptyLines && _line.replace(/^\s*$/,"").length == 0) continue;
            if (options.perLinePrefix) _line = options.perLinePrefix + _line;
            if (!!commentConfig && commentConfig.lineComment) {
                _line = commentConfig.lineComment + _line;
            }
            if (options.trimTrailingWhitespaces) {
				_line = _line.replace(/\s*$/,"");
			}
			bannerText += _line + "\n";
        }
        if (useBlockComment) bannerText += commentConfig.blockComment[1];
    } catch (replaceErr) {
		err = replaceErr;
	} finally {
        if (err) {
        vscode.window.showErrorMessage(err.message);
        } else {
            return bannerText;
        }
    }
}





/* 
    UTILITIES
*/
function formatConfigFromSettings(config) {
    var pbcConfig = vscode.workspace.getConfiguration(BCP_CONFIG_NS);
    return {
        figletConfig: {
            font:                    (config.font || pbcConfig.font),
            horizontalLayout:        (config.horizontalLayout || pbcConfig.horizontalLayout),
            verticalLayout:          (config.verticalLayout || pbcConfig.verticalLayout)
        },
        options: {
            trimTrailingWhitespaces: (config.trimTrailingWhitespaces || pbcConfig.trimTrailingWhitespace),
            trimEmptyLines:          (config.trimEmptyLines || pbcConfig.trimEmptyLines),
            prefix:                  (config.prefix || pbcConfig.prefix),
            suffix:                  (config.suffix || pbcConfig.suffix) ,
            perLinePrefix:           (config.perLinePrefix || pbcConfig.perLinePrefix)
        },
        commentConfig:               getCommentConfig(config.languageId),
    }
}

function getDefaultConfig(languageId) {
    var bcpConfig = vscode.workspace.getConfiguration(BCP_CONFIG_NS);
    return {
        figletConfig: {
            font:                    (bcpConfig.get('font')                    || "Standard"),
            horizontalLayout:        (bcpConfig.get('horizontalLayout')        || "default" ),
            verticalLayout:          (bcpConfig.get('verticalLayout')          || "default" )
        },
        options: {
            trimTrailingWhitespaces: (bcpConfig.get("trimTrailingWhitespaces") || false),
            trimEmptyLines:          (bcpConfig.get("trimEmptyLines")          || false),
            prefix:                  (bcpConfig.get("prefix")                  || null ),
            suffix:                  (bcpConfig.get("suffix")                  || null ),
            perLinePrefix:           (bcpConfig.get("perLinePrefix")       || null )
        },
        commentConfig:               getCommentConfig(languageId)
    }
}

function getCommentConfig(languageId:string):any {
    let langConfig:any = getLanguageConfig(languageId);
    if (!langConfig) console.warn("BannerComments+: Language Config Not Found.");
    else             return langConfig.comments;
    return null;
}

function getLanguageConfig(languageId:string):any {
	var langConfig:any = null;
	const excludedLanguagesIds:any[] = ["plaintext"];

	if (!excludedLanguagesIds.includes(languageId)) {
		let langConfigFilepath:string;
		for (const _ext of vscode.extensions.all) {
			if (
				_ext.id.startsWith("vscode.") &&
				_ext.packageJSON.contributes &&
				_ext.packageJSON.contributes.languages
			) {
				const packageLangData:any = _ext.packageJSON.contributes.languages.find(
					_packageLangData => (_packageLangData.id === languageId)
				);
				if (!!packageLangData) {
					langConfigFilepath = path.join(
						_ext.extensionPath,
						packageLangData.configuration
					);
					break;
				}
			}
		}
		if (!!langConfigFilepath && fs.existsSync(langConfigFilepath)) {
			/**
			 * unfortunatly, some of vscode's language config contains
			 * comments... ("xml" and "xsl" for example)
			 */
			langConfig = commentJson.parse(
				fs.readFileSync(langConfigFilepath, "utf8")
			);
		}
		return langConfig;
	}
}

export function deactivate() { }
export function activate (context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("banner-comments-plus.Apply", apply),
        vscode.commands.registerCommand("banner-comments-plus.ApplyFromList", applyFromList),
        vscode.commands.registerCommand("banner-comments-plus.ApplyFromFavorites", applyFavorite),
        vscode.commands.registerCommand("banner-comments-plus.ApplyFromConfig", applyFromConfig),
        vscode.commands.registerCommand("banner-comments-plus.ApplyDirectFromConfig", applyDirectFromConfig),
        vscode.commands.registerCommand("banner-comments-plus.SetDefaultFont", setDefaultFont),
        vscode.commands.registerCommand("banner-comments-plus.SetDefaultFontFromFavorites", setDefaultFontFromFavorites),
        vscode.commands.registerCommand("banner-comments-plus.AddFontToFavorites", addFontToFavorites),
        vscode.commands.registerCommand("banner-comments-plus.AddCurrentFontToFavorites", addCurrentFontToFavorites),
        vscode.commands.registerCommand("banner-comments-plus.RemoveFontFromFavorites", removeFromFavorites)
    );
}
