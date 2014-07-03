/*globals chai, React, ReactTemplate, describe, it */
'use strict';

var assert = chai.assert;
var div = React.DOM.div;


describe('react-template', function () {

  it('creates a function', function() {
    var template = ReactTemplate.create({
      render: function() {}
    });
    assert.typeOf(template, 'function');
  });

  it('returns a template that calls the render function', function() {
    var template = ReactTemplate.create({
      render: function() {
        return div();
      }
    });
    assert(React.isValidComponent(template()));
  });

  it('receives props', function() {
    var template = ReactTemplate.create({
      render: function() {
        assert.equal(this.props.hasProp, true);
        return div();
      }
    });
    template({hasProp: true});
  });

  it('applies default props', function() {
    var template = ReactTemplate.create({
      getDefaultProps: function() {
        return {name: 'Matthew'};
      },
      render: function() {
        assert.equal(this.props.name, 'Matthew');
        return div();
      }
    });
    template();
  });

  it('warns when a propType check fails', function() {
    // Mock `console.warn`
    var oldWarn = console.warn;
    var newWarn = function() {
      newWarn.called = true;
    };
    console.warn = newWarn;

    var template = ReactTemplate.create({
      propTypes: {
        name: React.PropTypes.string
      },
      render: function() {
        return div();
      }
    });
    template({name: 1});
    assert(newWarn.called);

    // Fix `console.warn`
    console.warn = oldWarn;
  });

  it('can be given a plain old function', function() {
    var template = ReactTemplate.create(function() {
      assert.equal(this.props.hasProp, true);
      return div();
    });
    template({hasProp: true});
  });
});
