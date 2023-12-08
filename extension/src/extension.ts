
import { commands, ExtensionContext, window } from "vscode";
import { CodeScribeWebViewPanel, SidebarProvider } from "./panels";


export function activate(context: ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    window.registerWebviewViewProvider("codescribe-view", sidebarProvider)
  );

  context.subscriptions.push(
    commands.registerCommand("codescribe.initialize", () => {
      CodeScribeWebViewPanel.render(context.extensionUri);
    })
  );
  context.subscriptions.push(
    commands.registerCommand("codescribe.generateDoc", () => {
      window.showInformationMessage("Hello World from Codescribe!");
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() { }
