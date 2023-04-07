
module.exports = function (babel) {
	const { types: t } = babel;
	return {
		name: "cjs-to-esm",
		visitor: {
			CallExpression(path) {
				if (t.isIdentifier(path.node.callee, { name: "require" })) {
					if (path.parentPath.node.type === "VariableDeclarator") {
						let newNode;
						if (t.isObjectPattern(path.parentPath.node.id)) {
							newNode = t.importDeclaration(
								path.parentPath.node.id.properties.map((item) => {
									return t.importSpecifier(
										t.identifier(item.key.name),
										t.identifier(item.value.name)
									);
								}),
								t.stringLiteral(path.node.arguments[0].value)
							);
							path.parentPath.replaceWith(newNode);
						} else {
							newNode = t.importDeclaration(
								[
									t.importDefaultSpecifier(
										t.identifier(path.parentPath.node.id.name)
									),
								],
								t.stringLiteral(path.node.arguments[0].value)
							);
							path.parentPath.replaceWith(newNode);
						}
					}
					if (path.parentPath.node.type === "VariableDeclaration") {
						const newNode = t.importDeclaration(
							[
								t.importDefaultSpecifier(
									t.identifier(path.parentPath.node.declarations[0].id.name)
								),
							],
							t.stringLiteral(path.node.arguments[0].value)
						);
						path.parentPath.replaceWith(newNode);
					}
					if (path.parentPath.node.type === "ObjectProperty") {
						const newNode = t.importDeclaration(
							[
								t.importDefaultSpecifier(
									t.identifier(path.parentPath.node.key.name)
								),
							],
							t.stringLiteral(path.node.arguments[0].value)
						);
						path.parentPath.replaceWith(newNode);
					}
					if (path.parentPath.node.type === "ObjectExpression") {
						const newNode = t.importDeclaration(
							[
								t.importDefaultSpecifier(
									t.identifier(path.parentPath.node.properties[0].key.name)
								),
							],
							t.stringLiteral(path.node.arguments[0].value)
						);
						path.parentPath.replaceWith(newNode);
					}
					if (path.parentPath.node.type === "CallExpression") {
						const newNode = t.importDeclaration(
							[
								t.importDefaultSpecifier(
									t.identifier(path.parentPath.node.arguments[0].name)
								),
							],
							t.stringLiteral(path.node.arguments[0].value)
						);
						path.parentPath.replaceWith(newNode);
					}
					//删除最左则的const或var,但是要保留 import语句
					if (path.parentPath.parentPath.node.type === "VariableDeclaration") {
						path.parentPath.parentPath.replaceWith(path.parentPath.node);
					}
				}
			},
			AssignmentExpression(path) {
				if (
					t.isMemberExpression(path.node.left) &&
					t.isIdentifier(path.node.left.object, { name: "module" }) &&
					t.isIdentifier(path.node.left.property, { name: "exports" })
				) {
					const newNode = t.exportDefaultDeclaration(path.node.right);
					path.parentPath.replaceWith(newNode);
				} else if (
					t.isMemberExpression(path.node.left) &&
					t.isIdentifier(path.node.left.object, { name: "exports" })
				) {
					//如果path.node.right是一个Identifier，那么就是exports.a = a;这种情况
					if (t.isIdentifier(path.node.right)) {
						const newNode = t.exportNamedDeclaration(
							null,
							[t.exportSpecifier(t.identifier(path.node.left.property.name), t.identifier(path.node.left.property.name))],
							null
						);
						path.parentPath.replaceWith(newNode);
					} else {
						//如果path.node.right是一个值，那么就是exports.a = 1;这种情况
						const newNode = t.variableDeclaration("let", [
							t.variableDeclarator(
								t.identifier(path.node.left.property.name),
								path.node.right
							),
						]);
						path.parentPath.replaceWith(newNode);
						const newNode2 = t.exportNamedDeclaration(
							null,
							[t.exportSpecifier(t.identifier(path.node.left.property.name), t.identifier(path.node.left.property.name))],
							null
						);
						path.insertAfter(newNode2);
					}
				}
			},
		},
	};
};
