import Backbone from 'backbone';
import _ from 'underscore';
import baseFilter from './base_filter';
import seed from './../../db/seeds/project_sections.json';


class Model extends baseFilter.Model {
	get resourceName() { return 'project_section'; }

	getEditUrl() { return null; }
	getNewUrl() { return null; }
	getDeleteUrl() { return null; }
}

class Collection extends baseFilter.Collection {

	get dbSeed() { return seed; }

	get model() { return Model; }

	get hasSingleActiveChild() { return false; }

	get initializeActiveStatesOnReset() { return true; }

	initialize() {
		this.reset(seed);
	}

}

export default {
	Model: Model,
	Collection: Collection
}