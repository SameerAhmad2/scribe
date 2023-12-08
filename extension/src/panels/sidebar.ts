import { TextDocument, Webview, WebviewView, WebviewViewProvider, Uri } from "vscode";
import { getWebviewContent, handleMessageFromWebview } from "./common";

export class SidebarProvider implements WebviewViewProvider {
  _view?: WebviewView;
  _doc?: TextDocument;

  constructor(private readonly _extensionUri: Uri) { }

  public resolveWebviewView(webviewView: WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);

    this._setWebviewMessageListener(webviewView.webview);
  }

  public revive(panel: WebviewView) {
    this._view = panel;
  }

  private _getWebviewContent = getWebviewContent

  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const response = handleMessageFromWebview({ message });
        response ? this._view?.webview.postMessage(response) : null;
      }, undefined);
  }
}
