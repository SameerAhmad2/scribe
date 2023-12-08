import * as vscode from "vscode";


/**
 * Returns the highlighted text in the currently active window
 * @returns An object containing the content and the range of the
 * highlighted text. `null` if no text is highlighted
 */
export const selectTextFromEdtior = (): { content: string, range: vscode.Range } | null => {
  const editor = vscode.window.activeTextEditor;
  const selection = editor?.selection;

  if (selection && !selection.isEmpty) {
    const selectionRange = new vscode.Range(
      selection?.start.line,
      selection?.start.character,
      selection?.end.line,
      selection?.end.character
    );
    const highlighted = editor.document.getText(selectionRange);
    return { content: highlighted, range: selectionRange };
  }

  return null;
};


/**
 * Replaces the text inside the given range with the `content`
 * @param content The new text that will overwrite the selected text
 * @param range Range of the text to replace
 */

export const pushChangesToEditor = (content: string, range: vscode.Range): void => {
  vscode.window.activeTextEditor?.edit((editBuilder) => {
    editBuilder.replace(range, content + '\n');
  })
}


/**
 * Returns the language of source code in the currently active window
 * @returns A string value representing the respective language identifier.
 */

export const selectLanguageFromEditor = (): string | undefined => {
  return vscode.window.activeTextEditor?.document.languageId;
}
