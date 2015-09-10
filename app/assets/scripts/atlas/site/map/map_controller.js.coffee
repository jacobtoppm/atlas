@Atlas.module 'Map', (Map) ->

	Map.Controller = 

		show: ->
			$().ensureScript('L', '/assets/vendor/mapbox.js', @showMain.bind(@))

		showMain: ->
			Map.rootView = new Map.RootView().render()
			@$loading = $("<div class='loading-icon'><div>Loading...</div></div>")
			$('.atl__main').append(@$loading)
			$().ensureScript('d3', '/assets/vendor/d3.min.js', @showOverlay.bind(@))
			
		showOverlay: ->

			items = Map.props.project.get('data').items
			itemType = items.getItemType()

			if itemType is 'state'
				View = Map.PathOverlayView 
			else 
				View = Map.PindropOverlayView

			launch = (baseGeoData) ->
				coll = items.getRichGeoJson(baseGeoData)
				coll.onReady ->
					overlayView = new View()
					overlayView.map = Map.map
					overlayView.collection = coll
					# expose to module
					Map.overlayView = overlayView
					overlayView.render()

			@getStateBaseGeoData(launch)

			@

		# Get state geodata and store it on the application instance.
		# TODO: factor out this method and make its storage path more clear (App.dataCache....).
		getStateBaseGeoData: (next) ->
			data = Map.props.App['us-states-10m']
			return next(data) if data?
			$.ajax
				url: '/data/us-states-10m.js'
				dataType: 'script'
				success: () ->
					next(Map.props.App['us-states-10m'])


		# Destroys view, including map base and overlay.
		destroy: ->
			Map.overlayView.destroy() if Map.overlayView?
			Map.rootView.destroy() if Map.rootView?