react-template
==============

Define a template using React.

**BUT ISN'T THAT WHAT COMPONENTS ARE FOR???**

Yes, but components come with some extra baggage. For one, if you replace a
component with another, the first will unmount and the second will mount.
Sometimes, that's not what you want. For example, if you're rendering entire
pages, you'd probably want the common elements to remain (without being
unmounted).

So normally you just use functions for this—your component just calls functions
and uses their return values in its render:

```jsx
React.createClass({
  render: function() {
    return (
      <div>
        { renderSomethingElse() }
      </div>
    );
  }
});
```

That's fine, but plain old functions don't let you have default props or easily
handle children. So that's where ReactTemplate comes in. It creates functions
for you to use in your components' `render()` methods, but adds some goodies
that you've come to expect from working with components using a familiar API.
You can think of it kind of like a lightweight component—without state or
lifecycle hooks. Here are some examples:


## Use `this.props`

```jsx
var Hello = ReactTemplate.create({
  render: function() {
    return (
      <div>
        Hello {this.props.name}!
        {this.props.children}
      </div>
    );
  }
});
```

Use it like normal in another component's `render()`:

```jsx
var MyComponent = React.createClass({
  render: function() {
    return (
      <div>
        <Hello name="Mary">
          <span>!</span>
        </Hello>
      </div>
    );
  }
});
```


## Define default props

```jsx
var Hello = ReactTemplate.create({
  getDefaultProps: function() {
    return {name: 'Joe'};
  },
  render: function() {
    return (
      <div>
        Hello {this.props.name}!
        {this.props.children}
      </div>
    );
  }
});
```


## Specify prop types

```jsx
var Hello = ReactTemplate.create({
  propTypes: {
    name: PropTypes.string
  },
  getDefaultProps: function() {
    return {name: 'Joe'};
  },
  render: function() {
    return (
      <div>
        Hello {this.props.name}!
        {this.props.children}
      </div>
    );
  }
});
```


## Just pass a `render` function if you only want props/children formatting

```jsx
var Hello = ReactTemplate.create(function() {
  return (
    <div>
      Hello {this.props.name}!
      {this.props.children}
    </div>
  );
});
```
