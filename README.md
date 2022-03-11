# wo-library

## Optimizations

### Providers

- When using `useMethods` from the `react-use` library,

  - To create dispatcher methods, memoize the state argument before passing it to the function by wrapping in a `useMemo` or else the provider would return new state and methods everytime, causing extra re-renders.  

  - Wrap the returned methods object in another `useMemo` making sure that it isn’t treated as a new variable even when the state changes.
  
- Create two providers, one with the state values and the others with the dispatcher/methods values. Since the methods are fixed, this way any components consuming only the methods would not be re-rendered even if the state of the provider changes.
