'use strict';

var __DEV__ = true; // TODO: Replace this based on environment.
var React = require('react');
var invariant = require('react/lib/invariant');
var warning = require('react/lib/warning');
var extend = require('xtend');

/**
 * Updates the `children` attribute of the provided props object to accurately
 * reflect the argument list (since you can pass in children as more than one
 * argument). Mutates the provided `props` object. Taken from
 * `ReactDescriptor.createFactory`.
 */
function formatProps(props, children) {
  if (props == null) {
    props = {};
  } else {
    props = extend(props);
  }

  var childrenLength = arguments.length - 1;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = new Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 1];
    }
    props.children = childArray;
  }
  return props;
}

/**
 * Adds the missing defaults to the provided props object. This function mutates
 * the props object. Taken from `ReactCompositeComponent.mountComponent`.
 */
function fillDefaultProps(props, defaultProps) {
  for (var propName in defaultProps) {
    if (typeof props[propName] === 'undefined') {
      props[propName] = defaultProps[propName];
    }
  }
}


/**
 * Assert that the props are valid. Taken from
 * `ReactCompositeComponent._checkPropTypes`
 *
 * @param {object} propTypes Map of prop name to a ReactPropType
 * @param {object} props
 * @param {string} location e.g. "prop", "context", "child context"
 */
function checkPropTypes(propTypes, props, location) {
  for (var propName in propTypes) {
    if (propTypes.hasOwnProperty(propName)) {
      var error =
        propTypes[propName](props, propName, 'ReactTemplate', location);
      if (error instanceof Error) {
        warning(false, error.message);
      }
    }
  }
}

function createTemplate(spec) {
  // Allow for creation using just a function.
  if (typeof spec === 'function') {
    spec = {render: spec};
  }

  var render = spec.render;

  invariant(
    render,
    'You must provide a render function.'
  );

  // Create a template function.
  var template = function(props, children) {
    props = formatProps.apply(null, arguments);

    // Fill in the defaults.
    var defaultProps = spec.getDefaultProps ? spec.getDefaultProps() : null;
    fillDefaultProps(props, defaultProps);

    // Check the prop types.
    if (__DEV__) {
      var propTypes = spec.propTypes;
      if (propTypes) {
        checkPropTypes(propTypes, props, 'prop');
      }
    }

    // Create a context with a `props` property and bound methods.
    var ctx = {props: props};
    for (var key in spec) {
      if (!spec.hasOwnProperty(key)) continue;
      var member = spec[key];
      if (typeof member === 'function') {
        ctx[key] = member.bind(ctx);
      } else {
        ctx[key] = member;
      }
    }

    // Call the render method.
    var el = ctx.render();
    invariant(
      (React.isValidElement || React.isValidComponent)(el),
      'A valid ReactComponent must be returned. You may have ' +
      'returned undefined, an array or some other invalid object.'
    );
    return el;
  };

  if (spec.statics) {
    for (var k in spec.statics) {
      if (!spec.statics.hasOwnProperty(k)) continue;
      template[k] = spec.statics[k];
    }
  }

  return template;
}

module.exports = {
  create: createTemplate
};
