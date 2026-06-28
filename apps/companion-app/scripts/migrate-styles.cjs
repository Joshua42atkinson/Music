module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Mapping simple CSS properties to Tailwind classes
  const twMap = {
    display: { flex: 'flex', block: 'block', inline: 'inline', 'inline-block': 'inline-block', none: 'hidden' },
    flexDirection: { column: 'flex-col', row: 'flex-row' },
    alignItems: { center: 'items-center', 'flex-start': 'items-start', 'flex-end': 'items-end', stretch: 'items-stretch' },
    justifyContent: { center: 'justify-center', 'space-between': 'justify-between', 'space-around': 'justify-around', 'flex-start': 'justify-start', 'flex-end': 'justify-end' },
    position: { absolute: 'absolute', relative: 'relative', fixed: 'fixed' },
    width: { '100%': 'w-full' },
    height: { '100%': 'h-full', '100vh': 'h-screen' },
    textAlign: { center: 'text-center', left: 'text-left', right: 'text-right' },
    fontWeight: { bold: 'font-bold', normal: 'font-normal' }
  };

  let fileModified = false;

  root.find(j.JSXOpeningElement).forEach(path => {
    const styleAttr = path.node.attributes.find(
      attr => attr.type === 'JSXAttribute' && attr.name.name === 'style'
    );

    if (styleAttr && styleAttr.value && styleAttr.value.type === 'JSXExpressionContainer') {
      const styleObj = styleAttr.value.expression;
      if (styleObj.type === 'ObjectExpression') {
        const newProps = [];
        const twClasses = [];
        let modified = false;
        let skipNode = false;

        styleObj.properties.forEach(prop => {
          if (prop.type === 'Property' && prop.key.type === 'Identifier' && prop.value.type === 'Literal') {
            const key = prop.key.name;
            const val = prop.value.value;

            if (twMap[key] && twMap[key][val]) {
              twClasses.push(twMap[key][val]);
              modified = true;
            } else {
              newProps.push(prop);
            }
          } else {
            newProps.push(prop);
          }
        });

        if (modified && !skipNode) {
          // If we found valid tailwind classes, append them to className
          if (twClasses.length > 0) {
            let classAttr = path.node.attributes.find(
              attr => attr.type === 'JSXAttribute' && attr.name.name === 'className'
            );
            const classesStr = twClasses.join(' ');
            if (classAttr) {
              if (classAttr.value.type === 'StringLiteral') {
                classAttr.value.value += ' ' + classesStr;
              } else {
                 skipNode = true;
              }
            } else {
              path.node.attributes.push(
                j.jsxAttribute(j.jsxIdentifier('className'), j.stringLiteral(classesStr))
              );
            }
          }

          if (!skipNode) {
            // Update style prop with remaining props
            if (newProps.length === 0) {
              path.node.attributes = path.node.attributes.filter(attr => attr !== styleAttr);
            } else {
              styleObj.properties = newProps;
            }
            fileModified = true;
          }
        }
      }
    }
  });

  return fileModified ? root.toSource() : null;
};
