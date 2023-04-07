module.exports = function (babel) {
	const { types: t } = babel;
	return {
		name: "esm-to-cjs",
		visitor: {
			ImportDeclaration(path) {
				const { node } = path;
				const specifiers = node.specifiers;
				const source = node.source;
				if (t.isImportDefaultSpecifier(specifiers[0])) {
					const newNode = t.variableDeclaration("const", [t.variableDeclarator(t.identifier(specifiers[0].local.name), t.callExpression(t.identifier("require"), [source]))]);
					path.replaceWith(newNode);
				} else {
					const newNode = t.variableDeclaration("const", [t.variableDeclarator(t.objectPattern(
						specifiers.map(item => t.objectProperty(t.identifier(item.local.name), t.identifier(item.local.name), false, true)))
						, t.callExpression(t.identifier("require"), [source]))]);
					path.replaceWith(newNode);
				}
			},
			ExportNamedDeclaration(path) {
				const { node } = path;
				if (node.declaration) {
					const identifierName = node.declaration.declarations[0].id;
					const newNode = t.expressionStatement(
						t.assignmentExpression("=",
							t.memberExpression(
								t.identifier("exports"),
								identifierName),
							identifierName));
					path.replaceWithMultiple([node.declaration, newNode]);
				}
			},
			ExportDefaultDeclaration(path) {
				const { node } = path;
				//判断如果node.declaration是一个标识符，也就是变量的话
				if (t.isIdentifier(node.declaration)) {
					const newNode = t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("module"), t.identifier("exports")), node.declaration));
					path.replaceWith(newNode);
				} else {
					const newNode = t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("module"), t.identifier("exports")), node.declaration));
					path.replaceWith(newNode);
				}
			}
		}
	};
};