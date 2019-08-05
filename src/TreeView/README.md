### data

An array of objects with the following structure:

| property   | type             | default  | description                                                                                                         |
| ---------- | ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `id`       | `integer`        | required | Unique identifier of the node                                                                                       |
| `name`     | `string`         | required | Used to match on key press                                                                                          |
| `children` | `array[integer]` | required | An array with the ids of the children. The first item of the array represents the root node and won't be displayed. |
| `parent`   | `integer`        | required | The parent of the node. `null` for the root node                                                                    |

Example:

```js static
const data = [
  { name: "", children: [1, 4, 9, 10, 11], id: 0, parent: null },
  { name: "src", children: [2, 3], id: 1, parent: 0 },
  { name: "index.js", id: 2, parent: 1 },
  { name: "styles.css", id: 3, parent: 1 },
  { name: "node_modules", children: [5, 7], id: 4, parent: 0 },
  { name: "react-accessible-treeview", children: [6], id: 5, parent: 4 },
  { name: "bundle.js", id: 6, parent: 5 },
  { name: "react", children: [8], id: 7, parent: 4 },
  { name: "bundle.js", id: 8, parent: 7 },
  { name: ".npmignore", id: 9, parent: 0 },
  { name: "package.json", id: 10, parent: 0 },
  { name: "webpack.config.js", id: 11, parent: 0 }
];
```

The array can also be generated from a nested object using the <code>flattenTree</code> helper (see the examples below).

### nodeRenderer

- _Arguments_: An object containing the following properties:

| property       | type                  | description                                                          |
| -------------- | --------------------- | -------------------------------------------------------------------- |
| `element`      | `object`              | The object that represents the rendered node                         |
| `getNodeProps` | `function`            | A function which gives back the props to pass to the node            |
| `isBranch`     | `bool`                | Whether the rendered node is a branch node                           |
| `isExpanded`   | `bool` or `undefined` | If the node is a branch node, whether it is expanded, else undefined |
| `expandedIds`  | `array`               | An array formed of the ids of the expanded nodes                     |
| `level`        | `number`              | An integer that corresponds to the aria-level attribute              |
| `setsize`      | `number`              | An integer that corresponds to the aria-setsize attribute            |
| `posinset`     | `number`              | An integer that corresponds to the aria-posinset attribute           |

### onSelect

- _Arguments_: An object containing `element`, `isBranch`, `isExpanded` and `expandedIds` (see nodeRenderer for an explanation).

Note: `isExpanded` and `expandedIds` refer to the state _after_ the selection.

<br/>
<br/>
<br/>
<br/>

### Keyboard Navigation

Follows the same convention described in https://www.w3.org/TR/wai-aria-practices/examples/treeview/treeview-1/treeview-1b.html.

| Key                        | Function                                                                                                                                                                                                                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Enter` or `Space`         | Updates the selected node to the current node and triggers `onSelect`                                                                                                                                                                                                                               |
| <code>Down Arrow </code>   | <ul><li>Moves focus to the next node that is focusable without opening or closing a node.</li> <li>If focus is on the last node, does nothing.</li></ul>                                                                                                                                            |
| <code> Up arrow </code>    | <ul><li> Moves focus to the previous node that is focusable without opening or closing a node. </li><li> If focus is on the first node, does nothing.</li></ul>                                                                                                                                     |
| <code>Right Arrow </code>  | <ul><li>When focus is on a closed node, opens the node; focus does not move.</li> <li> When focus is on an end node, does nothing.</li><li> When focus is on a open node, moves focus to the first child node. </li></ul>                                                                           |
| <code>Left Arrow </code>   | <ul> <li>When focus is on an open node, closes the node.</li> <li>When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.</li> <li> When focus is on a root node that is also either an end node or a closed node, does nothing.</li> </ul> |
| <code>Home</code>          | Moves focus to first node without opening or closing a node.                                                                                                                                                                                                                                        |
| <code>End</code>           | Moves focus to the last node that can be focused without expanding any nodes that are closed.                                                                                                                                                                                                       |
| <code>a-z, A-Z</code>      | <ul> <li>Focus moves to the next node with a name that starts with the typed character.</li> <li>Search wraps to first node if a matching name is not found among the nodes that follow the focused node.</li> <li>Search ignores nodes that are descendants of closed nodes.</li> </ul>            |
| <code>\*</code> (asterisk) | <ul><li> Expands all closed sibling nodes that are at the same level as the focused node.</li><li> Focus does not move.</li></ul>                                                                                                                                                                   |

### Mouse Navigation

| Key           | Function                                                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Click`       | toggle parent nodes and also `(select: default | exclusiveSelect | focus)`                                                                                 |
| `Ctrl+Click`  | If `multiselect` is `true`, selects the node without dropping the current selected ones. If false, it selects the current node. Doesn't toggle parents.    |
| `Shift+Click` | If `multiselect` is `true`, selects from the node without dropping the current selected ones. If false, it focus the current node. Doesn't toggle parents. |

<br/>
<br/>
<br/>
<br/>
