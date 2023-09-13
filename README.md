# react-accessible-treeview [![Build Status](https://travis-ci.org/lissitz/react-accessible-treeview.svg?branch=master)](https://travis-ci.org/lissitz/react-accessible-treeview) [![Greenkeeper badge](https://badges.greenkeeper.io/lissitz/react-accessible-treeview.svg)](https://greenkeeper.io/) [![npm version](https://badge.fury.io/js/react-accessible-treeview.svg)](https://badge.fury.io/js/react-accessible-treeview) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A react component that implements the treeview pattern as described by the [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices/#TreeView).

### Features

- Single and multiple selection.
- Disabled nodes.
- Extensive key bindings.
- Highly customizable through the use of the render prop and prop getter patterns.
- WAI-ARIA compliant.

### Documentation and Demo

- https://dgreene1.github.io/react-accessible-treeview

## Prop Types

| Prop name                | Type          | Default value | Description                                                                                                                                                               |
| ------------------------ | ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`                   | `array[node]` | `required`    | Tree data                                                                                                                                                                 |
| `nodeRenderer`           | `func`        | `required`    | Render prop for the node (see below for more details)                                                                                                                     |
| `onSelect`               | `func`        | `noop`        | Function called when a node changes its selected state                                                                                                                    |
| `onNodeSelect`           | `func`        | `noop`        | Function called when a node was manually selected/deselected                                                                                                              |
| `onExpand`               | `func`        | `noop`        | Function called when a node changes its expanded state                                                                                                                    |
| `className`              | `string`      | `""`          | className to add to the outermost dom element, al `ul` with `role = "tree"`                                                                                               |
| `multiSelect`            | `bool`        | `false`       | Allows multiple nodes to be selected                                                                                                                                      |
| `propagateSelect`        | `bool`        | `false`       | If set to true, selecting a node will also select its descendants                                                                                                         |
| `propagateSelectUpwards` | `bool`        | `false`       | If set to true, selecting a node will update the state of its parent (e.g. a parent node in a checkbox will be automatically selected if all of its children are selected |
| `propagateCollapse`      | `bool`        | `false`       | If set to true, collapsing a node will also collapse its descendants                                                                                                      |
| `expandOnKeyboardSelect` | `bool`        | `false`       | Selecting a node with a keyboard (using Space or Enter) will also toggle its expanded state                                                                               |
| `togglableSelect`        | `bool`        | `false`       | Whether the selected state is togglable                                                                                                                                   |
| `defaultSelectedIds`     | `array`       | `[]`          | Array with the ids of the default selected nodes                                                                                                                          |
| `defaultExpandedIds`     | `array`       | `[]`          | Array with the ids of the default expanded nodes                                                                                                                          |
| `defaultDisabledIds`     | `array`       | `[]`          | Array with the ids of the default disabled nodes                                                                                                                          |
| `selectedIds`            | `array`       | `[]`          | (Controlled) Array with the ids that should be selected                                                                                                                   |
| `expandedIds`            | `array`       | `[]`          | (Controlled) Array with the ids of branch node that should be expanded                                                                                                    |
| `clickAction`            | `enum`        | `SELECT`      | Action to perform on click. One of: EXCLUSIVE_SELECT, FOCUS, SELECT                                                                                                       |
| `onBlur`                 | `func`        | `noop`        | Custom onBlur event that is triggered when focusing out of the component as a whole (moving focus between the nodes won't trigger it).                                    |

<br/> <br/>

## data

An array of nodes. Nodes are objects with the following structure:

| Property   | Type                 | Default  | Description                                                                                         |
| ---------- | -------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `id`       | `number` or `string` | required | A nonnegative integer or string that uniquely identifies the node                                   |
| `name`     | `string`             | required | Used to match on key press                                                                          |
| `children` | `array[id]`          | required | An array with the ids of the children nodes.                                                        |
| `parent`   | `id`                 | required | The parent of the node. `null` for the root node                                                    |
| `isBranch` | `boolean`            | optional | Used to indicated whether a node is branch to be able load async data onExpand, default is false    |
| `metadata` | `object`             | optional | Used to add metadata into node object. We do not currently support metadata that is a nested object |

The item with `parent:null` of the array represents the root node and won't be displayed.

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
  { name: "webpack.config.js", id: 11, parent: 0 },
];
```

The array can also be generated from a nested object using the `flattenTree` helper (see the examples below). `flattenTree` preserves `metadata`.

Data supports non-sequential ids provided by user.

<br/> <br/>

## nodeRenderer

- _Arguments_: An object containing the following properties:

| Property         | Type                  | Description                                                                                           |
| ---------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| `element`        | `object`              | The object that represents the rendered node                                                          |
| `getNodeProps`   | `function`            | A function which gives back the props to pass to the node                                             |
| `isBranch`       | `bool`                | Whether the rendered node is a branch node                                                            |
| `isSelected`     | `bool`                | Whether the rendered node is selected                                                                 |
| `isHalfSelected` | `bool` or `undefined` | If the node is a branch node, whether it is half-selected, else undefined                             |
| `isExpanded`     | `bool` or `undefined` | If the node is a branch node, whether it is expanded, else undefined                                  |
| `isDisabled`     | `bool`                | Whether the rendered node is disabled                                                                 |
| `level`          | `number`              | A positive integer that corresponds to the aria-level attribute                                       |
| `setsize`        | `number`              | A positive integer that corresponds to the aria-setsize attribute                                     |
| `posinset`       | `number`              | A positive integer that corresponds to the aria-posinset attribute                                    |
| `handleSelect`   | `function`            | Function to assign to the onClick event handler of the element(s) that will toggle the selected state |
| `handleExpand`   | `function`            | Function to assign to the onClick event handler of the element(s) that will toggle the expanded state |
| `dispatch`       | `function`            | Function to dispatch actions                                                                          |
| `treeState`      | `object`              | state of the treeview                                                                                 |

<br/> <br/>

## onSelect

- _Arguments_: `onSelect({element, isBranch, isExpanded, isSelected, isHalfSelected, isDisabled, treeState })`
  Note: the function uses the state _after_ the selection.

## onNodeSelect

- _Arguments_: `onNodeSelect({element, isBranch, isSelected, treeState })`
  Note: the function uses the state right _after_ the selection before propagation.

## onExpand

- _Arguments_: `onExpand({element, isExpanded, isSelected, isHalfSelected, isDisabled, treeState})`
  Note: the function uses the state _after_ the expansion.

## onLoadData

- _Arguments_: `onLoadData({element, isExpanded, isSelected, isHalfSelected, isDisabled, treeState})`
  Note: the function uses the state _after_ inital data is loaded and on expansion.
  <br/> <br/>

## Keyboard Navigation

Follows the same conventions described in https://www.w3.org/TR/wai-aria-practices/examples/treeview/treeview-1/treeview-1b.html and https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-22.

| Key                  | Function                                                                                                                                                                                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Enter` or `Space`   | Updates the selected node to the current node and triggers `onSelect`                                                                                                                                                                                                                               |
| `Down Arrow`         | <ul><li>Moves focus to the next node that is tabbable without opening or closing a node.</li> <li>If focus is on the last node, does nothing.</li></ul>                                                                                                                                             |
| `Up arrow`           | <ul><li> Moves focus to the previous node that is tabbable without opening or closing a node. </li><li> If focus is on the first node, does nothing.</li></ul>                                                                                                                                      |
| `Right Arrow`        | <ul><li>When focus is on a closed node, opens the node; focus does not move.</li> <li> When focus is on an end node, does nothing.</li><li> When focus is on a open node, moves focus to the first child node. </li></ul>                                                                           |
| `Left Arrow`         | <ul> <li>When focus is on an open node, closes the node.</li> <li>When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.</li> <li> When focus is on a root node that is also either an end node or a closed node, does nothing.</li> </ul> |
| `Home`               | Moves focus to first node without opening or closing a node.                                                                                                                                                                                                                                        |
| `End`                | Moves focus to the last node that can be focused without expanding any nodes that are closed.                                                                                                                                                                                                       |
| `a-z, A-Z`           | <ul> <li>Focus moves to the next node with a name that starts with the typed character.</li> <li>Search wraps to first node if a matching name is not found among the nodes that follow the focused node.</li> <li>Search ignores nodes that are descendants of closed nodes.</li> </ul>            |
| `*` (asterisk)       | <ul><li> Expands all closed sibling nodes that are at the same level as the focused node.</li><li> Focus does not move.</li></ul>                                                                                                                                                                   |
| `Shift + Down Arrow` | Moves focus to and toggles the selection state of the next node.                                                                                                                                                                                                                                    |
| `Shift + Up Arrow`   | Moves focus to and toggles the selection state of the previous node.                                                                                                                                                                                                                                |
| `Ctrl + A`           | Selects all nodes in the tree. If all nodes are selected, unselects all nodes.                                                                                                                                                                                                                      |

<br/> <br/>

## Mouse Navigation

| Key           | Function                                                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Click`       | Toggles parent nodes and also performs one of `clickActions = SELECT, EXCLUSIVE_SELECT, FOCUS`                                                                    |
| `Ctrl+Click`  | If `multiselect` is set to `true`, selects the node without dropping the current selected ones. If false, it selects the clicked node. Doesn't toggle parents.    |
| `Shift+Click` | If `multiselect` is set to `true`, selects from the node without dropping the current selected ones. If false, it focus the clicked node. Doesn't toggle parents. |

<br/> <br/>

## Click actions

| Variant            | Function                                         |
| ------------------ | ------------------------------------------------ |
| `SELECT`           | Selects the clicked node (default).              |
| `EXCLUSIVE_SELECT` | Selects the clicked node and deselects the rest. |
| `FOCUS`            | Focuses the clicked node                         |

<br/> <br/>

## treeState

The internal state of the component.

| Property            | Type             | Default                          | Description                                           |
| ------------------- | ---------------- | -------------------------------- | ----------------------------------------------------- |
| selectedIds         | `Set`            | `new Set(defaultSelectedIds)`    | Set of the ids of the selected nodes                  |
| controlledIds       | `Set`            | `new Set(controlledSelectedIds)` | Set of the ids of the nodes selected programmatically |
| tabbableId          | `number`         | `data[0].children[0]`            | Id of the node with tabindex = 0                      |
| isFocused           | `bool`           | `false`                          | Whether the tree has focus                            |
| expandedIds         | `Set`            | `new Set(defaultExpandedIds)`    | Set of the ids of the expanded nodes                  |
| halfSelectedIds     | `Set`            | `new Set()`                      | Set of the ids of the selected nodes                  |
| lastUserSelect      | `number`         | `data[0].children[0]`            | Last selection made directly by the user              |
| lastInteractedWith  | `number or null` | `null`                           | Last node interacted with                             |
| lastManuallyToggled | `number or null` | `null`                           | Last node that was manually selected/deselected       |
| disabledIds         | `Set`            | `new Set(defaultDisabledIds)`    | Set of the ids of the selected nodes                  |
