@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	entityManager = new App.Base.EntityManager
		entitiesConstructor: App.Models.ProjectSections

	# Populated from ./db/seeds/ on the server.
	coll = new App.Models.ProjectSections();

	coll.initializeActiveStates()
	entityManager.entitiesCache = coll 

	App.reqres.setHandler 'project:section:entities', ->
		entityManager.getEntities({ cache: true })