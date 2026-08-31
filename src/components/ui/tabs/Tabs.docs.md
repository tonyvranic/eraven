# Tabs Component
A set of components for creating tabbed interfaces.

## Usage
```jsx
<TabsWrapper>
  <TabList>
    <Tab value="tab1" selected>Tab 1</Tab>
    <Tab value="tab2">Tab 2</Tab>
  </TabList>
  <TabPanelContainer>
    <TabPanel value="tab1" selected>Content for Tab 1</TabPanel>
    <TabPanel value="tab2">Content for Tab 2</TabPanel>
  </TabPanelContainer>
</TabsWrapper>
```
---

## Props
| Prop | Type | Default |
|---|---|---|
| value | `string` | required |
| slot | `Slot` | `HTML` |
---

## Events
| Component | Event | Detail |
|---|---|---|
| `Tab` | `tab-click` | `{ value: string }` |
| `TabsWrapper` | `tab-select` | `{ value: string }` |
---

## Data Flow
0. Both `Tab` and `TabPanel` feature `selected` props that determine their initial active state.
1. When a `Tab` is clicked, it dispatches a `tab-click` event with its `value`.
2. The `Tabs` component listens for `tab-click` events and dispatches a `tab-select` event to all `Tab` components with the selected `value`.
---

## Notes
- The suggested usage is a must for the components to work properly.
- The `value` prop is used to link `Tab` and `TabPanel` components together. <br> (For example, a `Tab` with `value="tab1"` will show the `TabPanel` with `value="tab1"` when clicked.)