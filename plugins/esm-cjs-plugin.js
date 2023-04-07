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
					if (t.isVariableDeclaration(node.declaration)) {
						const newNodes = [];
						for (let i = 0; i < node.declaration.declarations.length; i++) {
							const newNode = t.expressionStatement(
								t.assignmentExpression("=",
									t.memberExpression(t.identifier("exports"),
										node.declaration.declarations[i].id),
									node.declaration.declarations[i].init));
							newNodes.push(newNode);
						}
						path.replaceWithMultiple(newNodes);
					}
				} else {
					if (node.specifiers.length > 0) {
						const newNodes = [];
						for (let i = 0; i < node.specifiers.length; i++) {
							const newNode = t.expressionStatement(
								t.assignmentExpression("=",
									t.memberExpression(t.identifier("exports"),
										node.specifiers[i].exported),
									node.specifiers[i].local));
							newNodes.push(newNode);
						}
						path.replaceWithMultiple(newNodes);
					}
				}
			},
			ExportDefaultDeclaration(path) {
				const { node } = path;
				if (t.isIdentifier(node.declaration)) {
					const newNode = t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("module"), t.identifier("exports")), node.declaration));
					path.replaceWith(newNode);
				} else {
					if (t.isFunctionDeclaration(node.declaration)) {
						const newNode = t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("module"), t.identifier("exports")), t.functionExpression(null, node.declaration.params, node.declaration.body, node.declaration.generator, node.declaration.async)));
						path.replaceWith(newNode);
					} else if (t.isClassDeclaration(node.declaration)) {
						const newNode = t.expressionStatement(
							t.assignmentExpression("=",
								t.memberExpression(
									t.identifier("module"), t.identifier("exports")),
								t.classExpression(node.declaration.id,
									node.declaration.superClass,
									node.declaration.body, node.declaration.decorators
								)));
						path.replaceWith(newNode);
					} else {
						const newNode = t.expressionStatement(
							t.assignmentExpression("=",
								t.memberExpression(t.identifier("module"), t.identifier("exports")),
								node.declaration));
						path.replaceWith(newNode);
					}
				}
			}
		}
	};
};