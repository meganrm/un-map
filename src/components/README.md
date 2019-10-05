Components
==================

Components are the fundamental UI elements of this application. Ideally, they are stateless functional components, though
in more complex scenarios, they may be classes. Regardless of their type, they are solely concerned with accepting props and
returning JSX. 


### Example

For example, a component named `Button` should be structured like:
```
src/
    components/
        Button/
            index.tsx
            style.css
```

To use a `Button`: `import Button from "relative/path/to/components/Button"`


A component named `List`, which renders a subcomponent named `ListItem` should be structured like:
```
src/
   components/
        List/
            index.tsx
            list-item.tsx
            style.css
```
To use a `List`: `import List from "relative/path/to/components/List"`

