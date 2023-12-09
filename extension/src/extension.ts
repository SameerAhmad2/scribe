
import { commands, ExtensionContext, window } from "vscode";
import { ScribeWebViewPanel, SidebarProvider } from "./panels";


export function activate(context: ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    window.registerWebviewViewProvider("scribe-view", sidebarProvider)
  );

  context.subscriptions.push(
    commands.registerCommand("qcri-scribe-ai.initialize", () => {
      ScribeWebViewPanel.render(context.extensionUri);
    })
  );

  context.subscriptions.push(
    commands.registerCommand("qcri-scribe-ai.generateDoc", () => {
      window.showInformationMessage("Hello World from Scribe!");
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() { }
