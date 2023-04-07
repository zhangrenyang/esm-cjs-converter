const vscode = require('vscode');
const babel = require("@babel/core");
const esmCjsPlugin = require('./plugins/esm-cjs-plugin')
const cjsEsmPlugin = require('./plugins/cjs-esm-plugin')
function activate(context) {
	const esmoduleToCommonjsDisposable = vscode.commands.registerCommand('extension.esmoduleToCommonjs', function () {
		vscode.window.activeTextEditor.edit(editBuilder => {
			const text = vscode.window.activeTextEditor.document.getText();
			let { code } = babel.transformSync(text, {
				sourceType: 'module',
				plugins: [esmCjsPlugin]

			});
			const end = new vscode.Position(vscode.window.activeTextEditor.document.lineCount + 1, 0);
			editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), code);
		});
	});
	context.subscriptions.push(esmoduleToCommonjsDisposable);
	const commonjsToEsmoduleDisposable = vscode.commands.registerCommand('extension.commonjsToEsmodule', function () {
		vscode.window.activeTextEditor.edit(editBuilder => {
			const text = vscode.window.activeTextEditor.document.getText();
			let { code } = babel.transformSync(text, {
				sourceType: 'module',
				plugins: [cjsEsmPlugin]
			});
			const end = new vscode.Position(vscode.window.activeTextEditor.document.lineCount + 1, 0);
			editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), code);
		});
	});
	context.subscriptions.push(commonjsToEsmoduleDisposable);
}
function deactivate() { }
module.exports = {
	activate,
	deactivate
};