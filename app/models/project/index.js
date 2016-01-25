import _ from 'underscore'

import formatters from './../../utilities/formatters.js'

import * as base from './../base.js'
import * as projectSection from './../project_section.js'
import * as projectTemplate from './../project_template.js'
import * as filter from './../filter.js'
import * as variable from './../variable.js'
import * as variableGroup from './../variable_group.js'
import * as item from './../item/index.js'

import defaults from './defaults.json'

/*
 *
 *
 */
export class Model extends base.Model {

    get resourceName() { return 'project' }

    // API queries that need to be handled custom. For every key, there is a this.is_#{key} method that filters a model. 
    get customQueryKeys() { return [ 'related_to' ] }

    getIndexUrl() { return '/menu' }
    getViewUrl() { return `/${this.get('atlas_url')}` }

    get defaults() { return defaults }


    /*
     * Form fields.
     *
     */
    get fields() {
        return [

            {
                formComponentName: 'Text',
                formComponentProps: {
                    id: 'title',
                    labelText: 'Project Title',
                    hint: '',
                    placeholder: 'Enter Project Title'
                }
            },

            {
                formComponentName: 'Text',
                formComponentProps: {
                    id: 'atlas_url',
                    labelText: 'Atlas Url',
                    hint: 'The Url the project will live under, such as atlas.newamerica.org/my-pretty-url',
                    placeholder: 'Enter Atlas Url'
                }
            },

            {
                formComponentName: 'Text',
                formComponentProps: {
                    id: 'author',
                    labelText: 'Author',
                    hint: '',
                    placeholder: 'Enter Author'
                }
            },

            {
                formComponentName: 'Text',
                formComponentProps: {
                    id: 'short_description',
                    labelText: 'Short description',
                    hint: '',
                    placeholder: 'Enter Short Description'
                }
            },

            {
                formComponentName: 'Radio',
                formComponentProps: {
                    id: 'is_section_overview',
                    labelText: 'Is section overview.',
                    hint: 'Each section has one overview project - check if this is one of them:',
                    options: [ 'Yes', 'No' ],
                    defaultOption: 'Yes'
                }
            },

            {
                formComponentName: 'Radio',
                formComponentProps: {
                    id: 'is_live',
                    labelText: 'Is live.',
                    hint: 'Please specify whether this project is viewable on the live site. Changes take effect immediately.',
                    options: [ 'Yes', 'No' ],
                    defaultOption: 'Yes'
                }
            },

            {
                name: 'Project Sections',
                formComponentName: 'ForeignCollectionCheckBox',
                formComponentProps: {
                    id: 'project_section_ids',
                    foreignCollection: new projectSection.Collection(),
                    foreignCollectionDisplayField: 'name',
                    labelText: 'Project Sections',
                    hint: ''
                }
            },

            {
                formComponentName: 'ForeignCollectionRadio',
                formComponentProps: {
                    id: 'project_template_id',
                    foreignCollection: new projectTemplate.Collection(),
                    foreignCollectionDisplayField: 'name',
                    labelText: 'Project Template',
                    hint: 'The template will determine the way your project is visualized - select from below:'
                }
            },

            {
                formComponentName: 'SelectizeText',
                formComponentProps: {
                    id: 'tags',
                    labelText: 'Tags',
                    hint: 'Enter tags separated by commas:'
                }
            },

            {
                formComponentName: 'CKEditor',
                formComponentProps: {
                    id: 'body_text',
                    labelText: 'Body Text'
                }
            },

            {
                formComponentName: 'SpreadsheetFile',
                formComponentProps: {
                    id: 'data',
                    labelText: 'Data file',
                    hint: '',
                    worksheets: [ 'data', 'variables', 'variable groups' ]
                }
            },

            {
                formComponentName: 'ImageFile',
                formComponentProps: {
                    id: 'encoded_image',
                    labelText: 'Image File',
                    hint: 'Size limit: 3MB.'
                }
            },

            {
                formComponentName: 'Text',
                formComponentProps: {
                    id: 'image_credit',
                    labelText: 'Image Credit',
                    hint: "Single URL or Markdown, e.g. '[Shutterstock](http://www.shutterstock.com/imageurl)'",
                    placeholder: 'Image Credit'
                }
            }

        ]
    }




    /** 
     * Conversts model object to json
     * Checks if it has mandatory fields (id and more than one key). 
     * returns {boolean} - Whether madatory fields exist
     */
    exists() {
        var keyCount = Object.keys(this.toJSON()).length
        return (keyCount > 1)
    }


    /*
     * Returns image url.
     *
     */
    getImageUrl() {
        var encodedImage = this.get('encoded_image')
        if (encodedImage == null) { return }
        encodedImage = encodedImage.replace(/(\r\n|\n|\r)/gm, '')
        if (encodedImage.indexOf('base64') > -1) { return `url(${encodedImage})` }
        return `url('data:image/png;base64,${encodedImage}')`
    }


    /** 
     * Filters a project by two filterable collections that it belongs to.
     * @param {object} projectSections
     * @param {object} projectTemplates
     * @returns {boolean} filter - Whether both project sections and templates are in filter variable.
     */
    compositeFilter(projectSections, projectTemplates) {
        var sectionsFilter = this.filter(projectSections, 'project_section')
        var templatesFilter = this.filter(projectTemplates, 'project_template')
        var filter = sectionsFilter && templatesFilter
        return filter
    }


    /*
     * Custom query method to find related projects based on tags.
     * @param {string} project - Project Id.
     * @returns {boolean} - Related status.
     */
    isRelatedTo(project) {
        var prj, tags0, tags1
        // Project is not related to itself, it is itself :).
        if (this === project) { return false }
        tags0 = this.get('tags')
        tags1 = project.get('tags')
        if (tags0 === '' || tags1 === '') { return false }
        tags0 = tags0.split(',')
        tags1 = tags1.split(',')
        for (let tag0 of tags0) {
            if (tags1.indexOf(tag0) > -1) {
                return true
            }
        }
        return false
    }


    /**
     * Filter collection by its foreign key.
     * @param {object} collection
     * @param {string} foreignKey
     * @returns {boolean}
     */
    filter(collection, foreignKey) {
        if ((collection != null) && (collection.test != null)) {
            return collection.test(this, foreignKey)
        }
        return true
    }


    /*
     * Get imgage attribution html. 
     *
     */
    getImageAttributionHtml() {
        var cred = this.get('image_credit')
        return formatters.markdown(cred)
    }


    /*
     * Process entry spreadsheet data.
     *
     */
    beforeSave() {

        var varModel = new variable.Model()
        var varGroupModel = new variableGroup.Model()
        var data = this.get('data')

        function parseDataField(data, fieldName, parserModel) {
            if (data[fieldName]) {
                let fieldValues = data[fieldName]
                fieldValues = fieldValues.map((fieldValue) => parserModel.parse(fieldValue))
                data[fieldName] = fieldValues
            }
        }

        if (data) {
            parseDataField(data, 'variables', varModel)
            parseDataField(data, 'variable_groups', varGroupModel)
            // Rename data field to items (per name conflict from spreadsheet format convention).
            if (data.data) {
                data.items = data.data
                delete data.data
            }
        }

    }


    /** 
     * If there is a data field, convert to appropriate collections.
     *
     */
    buildData() {
        var data = this.get('data')
        if (data) {
            data.variables = new variable.Collection(data.variables)
            if (data.variable_groups) {
                data.variable_groups = new variableGroup.Collection(data.variable_groups)
                data.variable_groups.sort()
            }
            data.items = new item.Collection(data.items, { parse: true })
            this.buildFilterTree()
        }
    }


    /*
     * Build filter tree by taking each variable the display items are filtered by, and finding every possible value for each variable.
     * E.g. if the items are filtered by marital status and preferred pet, the return value of this method is schematically represented as follows:
     * { "marital_status": [ "single", "married", "divourced five times" ], "preferred_pet": [ "hamster", "comodo dragon", "lama" ] } 
     */
    buildFilterTree() {

        var filterTree, filterVariables
        var data = this.get('data')
        var { items, variables } = data

        filterVariables = variables.getFilterVariables().map(function(variable, index) {

            var formatter, nd, o, variable

            if (variable.get('format')) {
                let formatterName = variable.get('format')
                // formatterName = (formatterName !== 'markdown') ? 'number' : formatterName
                formatter = formatters[formatterName]
            }

            o = {
                variable: variable,
                variable_id: variable.get('id'),
                _isActive: (index === 0 ? true : false)
            }

            nd = variable.get('numerical_filter_dividers')

            if (nd != null) {
                o.values = variable.getNumericalFilter(formatter)
            } else {
                o.values = _.map(items.getValueList(variable), function(item) {
                    return { 
                        value: formatter ? formatter(item) : item 
                    }
                })
            }

            _.map(o.values, function(val) {
                val._isActive = true
                return val
            })

            return o

        })

        filterTree = { variables: filterVariables }

        data.filter = new filter.FilterTree(filterTree)
        data.filter.makeComposite()

        data.filter.state = {}

    }


    /**
     * Prepares model on the client.
     * @param {object} App - Marionette application instance. 
     */
    prepOnClient() {
        this.buildData()
        this.setHtmlToc('body_text')
        this.embedForeignModelNames()
    }


    /*
     *
     *
     */
    embedForeignModelNames() {
        var templates = new projectTemplate.Collection()
        var sections = new projectSection.Collection()
        this.addForeignField('project_template_id', templates, 'name')
        this.addForeignField('project_section_ids', sections, 'name')
        return this
    }


    /*
     * Return an integer friendly index value for the current hovered or active item.
     * Used in coloring.
     */
    getFriendlyIndeces() {
        var { items, filter } = this.get('data')
        var item = items.hovered || items.active
        return filter.getFriendlyIndeces(item, 15)
    }

}



/*
 *
 *
 */
export class Collection extends base.Collection {

    get model() { return Model }


    /**
     * Used to compare two models when sorting.
     * @param {object} model1
     * @param {object} model2
     * @returns {number} comparator - A comparator whose sign determines the sorting order.
     */
    comparator(model1, model2) {
        var i1 = model1.get('is_section_overview') === 'Yes' ? 10 : 0
        var i2 = model2.get('is_section_overview') === 'Yes' ? 10 : 0
        if (model1.get('title') < model2.get('title')) {
            i1 += 1
        } else {
            i2 += 1
        }
        return i2 - i1
    }


    /** 
     * Filter all children by project sections and templates.
     * @param {collection} projectSections
     * @param {collection} projectTemplates
     * @returns {object} this
     */
    filter(projectSections, projectTemplates) {
        if ((projectSections.models == null) || (projectSections.models.length === 0)) { return }
        if ((projectTemplates.models == null) || (projectTemplates.models.length === 0)) { return }
        if (this.models.length === 0) { return }
        this.models.forEach((model) => {
            model.compositeFilter(projectSections, projectTemplates)
        })
        return this
    }


    /**
     * Recognize and process server response.
     * @param {object} resp - Server response.
     * @returns {object} resp - Modified response.
     */
    parse(resp) {
        if (exports.Model.prototype.parse == null) { return resp }
        return resp.map(item => exports.Model.prototype.parse(item))
    }


    /*
     * API query filter.
     *
     */
    related_to(id) {

        var resp = []

        if (id == null) { return this.toJSON() }

        var referenceModel =  this.findWhere({ id: id })

        if (referenceModel == null) { return resp }

        this.each((model) => {
            if (model.isRelatedTo(referenceModel)) {
                resp.push(model.toJSON())
            }
        })

        return resp

    }

}