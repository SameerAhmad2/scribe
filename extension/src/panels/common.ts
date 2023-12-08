import { Position, Range, Uri, Webview, window } from "vscode";

// IMPORT HELPERS
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { pushChangesToEditor, selectLanguageFromEditor, selectTextFromEdtior } from "../interface";


export const handleMessageFromWebview = ({ message }: {
    message: any;
}): string | null => {
    const command = message.command;
    const message_data = message.text;

    switch (command) {

        // Commands to select text for documentation operations.
        case "define":
        case "revise":
        case "explain":
        case "annotate":
        case "analyze":
            const response = selectTextFromEdtior();
            const language = selectLanguageFromEditor();
            const additional_context = JSON.parse(message_data);
            if (!response?.content) { window.showErrorMessage("Highlight a code snippet from your editor"); break; }
            else { return JSON.stringify({ command, response, language, ...(additional_context === '' ? {} : additional_context) }); }

        // Command to get updatable content to push to editor
        case "update":
            const { content, range }: any = JSON.parse(message_data);
            const startPos = new Position(range[0].line, range[0].character)
            const endPos = new Position(range[0].line, range[0].character)
            const location = new Range(startPos, endPos);

            pushChangesToEditor(content, location);
            break;

        // Todo: Command to initialize PDF and MD generation.
        case "generate_md":
        case "generate_pdf":
            break;

        // Command to handle VSCode notifications.
        case "notify":
            window.showInformationMessage(message_data);
            break;

        // Command to handle error messages.
        case "error":
            // Code that should run in response to the hello message command.
            window.showErrorMessage(message_data);
            break;

        // Default case for exhaustive switch casing.
        default:
            window.showInformationMessage(`Unknown command \"${command}\" received! Flushing...`)
            break;
    }
    return null
}


export const getWebviewContent = (webview: Webview, extensionUri: Uri) => {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, [
        "webview-ui",
        "build",
        "static",
        "css",
        "main.f855e6bc.css",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, [
        "webview-ui",
        "build",
        "static",
        "js",
        "main.811c2c08.js",
    ]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <link rel="stylesheet" type="text/css" href="${stylesUri}">
            <title>Scribe</title>
          </head>
          <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
      `;
}