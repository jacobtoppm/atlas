import 'babel-polyfill'

import assert from 'assert'
import Backbone from 'backbone'
import _ from 'underscore'
import $ from 'jquery'

import * as variable from './../variable.js'
import * as variableGroup from './../variable_group.js'

describe('variable.Model', function() {

    var Model = variable.Model,
        model = new Model();

    describe('parse', function() {

        it('parses form input', function() {

            var data = {
                'Display Title': "Definition",
                'Filter Menu Order': 1,
                'Filter Type': "categorical",
                'Long Description': "How do states define college- and career-readiness?",
                'Short Description': "College- and Career-Ready Definition",
                'Variable Name': "definition",
                'Variable group Name': 'group 1'
            };

            assert.deepEqual(model.parse(data), {
                'display_title': "Definition",
                'filter_menu_order': 1,
                'filter_type': "categorical",
                'long_description': "How do states define college- and career-readiness?",
                'short_description': "College- and Career-Ready Definition",
                'id': 'definition',
                'variable_group_id': 'group 1'
            });

        });

    });

    describe('extractFilter', function() {

        it ('returns undefined if filter menu order is not set', function() {

            var model = new Model({ 'id': '1' });
            assert.equal(model.extractFilter(), undefined);

        });

        it ('extracts filter', function() {

            var model = new Model({ 'id': '1', 'filter_menu_order': 1, 'filter_type': 'categorical', 'numerical_filter_dividers': '100|200' });
            assert.deepEqual(model.extractFilter(), {
                'variable_id': '1',
                'menu_order': 1,
                'type': 'categorical',
                'numerical_dividers': '100|200'
            });

        });

    });

    describe('getNumericalFilter', function() {

        it('builds filter including +/- infinity values if leading and trailing delimiter marks are present', function() {
            model.set('numerical_filter_dividers', '|100|200|300|');
            assert.deepEqual(model.getNumericalFilter(), [{
                min: -100000000000,
                max: 100,
                value: 'Less than 100'
            }, {
                min: 100,
                max: 200,
                value: 'Between 100 and 200'
            }, {
                min: 200,
                max: 300,
                value: 'Between 200 and 300'
            }, {
                min: 300,
                max: +100000000000,
                value: 'Greater than 300'
            }]);
        });

        it('builds filter including - infinity values if only leading delimiter mark is present', function() {
            model.set('numerical_filter_dividers', '|100|200|300');
            assert.deepEqual(model.getNumericalFilter(), [{
                min: -100000000000,
                max: 100,
                value: 'Less than 100'
            }, {
                min: 100,
                max: 200,
                value: 'Between 100 and 200'
            }, {
                min: 200,
                max: 300,
                value: 'Between 200 and 300'
            }]);
        });

        it('builds filter including + infinity values if only trailing delimiter mark is present', function() {
            model.set('numerical_filter_dividers', '100|200|300|');
            assert.deepEqual(model.getNumericalFilter(), [{
                min: 100,
                max: 200,
                value: 'Between 100 and 200'
            }, {
                min: 200,
                max: 300,
                value: 'Between 200 and 300'
            }, {
                min: 300,
                max: +100000000000,
                value: 'Greater than 300'
            }]);
        });

        it('builds filter including negative numbers', function() {
            model.set('numerical_filter_dividers', '-100|-50|150');
            assert.deepEqual(model.getNumericalFilter(), [{
                min: -100,
                max: -50,
                value: 'Between -100 and -50'
            }, {
                min: -50,
                max: 150,
                value: 'Between -50 and 150'
            }]);
        });

    });
});


describe('variable.Collection', function() {

});