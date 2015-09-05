(function(){

Comp.Projects.Show.Explainer = class extends Comp.Static {

	render() {
		return (
			<div className="atl__main fill-parent" onScroll={ this.setStickyPageNav.bind(this) }>
				{ this.renderTitleBar('solid') }
				{ this.renderContentBar() }
			</div>
		);
	}

	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>{ this.getTitle() }</h1>
				<ul>
					<li>Updated: { this.getUpdateMoment() }</li>
				</ul>
			</div>
		);
	}

	renderPageNavContent() {
		return (
			<div className="atl__toc">
				<p>Page Contents</p>
				<div id="atl__toc__list">
					<ul>
						{ this.renderTocList() }
					</ul>
				</div>
			</div>
		);
	}

	renderPageContent() {
		return (
			<div>
				<div className="static-content" dangerouslySetInnerHTML={{ __html: this.getBodyText() }}>
				</div>
				<Comp.Projects.Show.Explainer.Related related={this.props.related} />
			</div>
		);
	}

	renderTocList() {
		var tocItems = this.props.project.get('body_text_toc');
		if (tocItems == null || tocItems.length === 0) { return; }
		return tocItems.map((item, i) => {
			return (
				<li className={'toc-'+item.tagName} key={'toc-' + i}>
					<a href={"#toc-"+item.id}>
						{ item.content }
					</a>
				</li>
			);
		});
	}

	componentDidMount() {
		this.buildAtlasCharts();
		this.setThemeColor();
	}

	componentWillUnmount() {
		this.destroyAtlasCharts();
	}

	getTitle() {
		var project = this.props.project;
		return (project != null) ? (project.get('title')) : '';
	}

	getBodyText() {
		var project = this.props.project;
		return (project != null) ? (project.get('body_text')) : '';
	}

	getUpdateMoment() {
		if (moment == null) { return; }
		return moment(this.props.project.get('updated_at')).format("MMMM Do YYYY");
	}

	buildAtlasCharts() {
		if (ChartistHtml == null) { return; }
		this.chartManager = new ChartistHtml.ChartCollectionManager($('.atlas-chart'));
		this.chartManager.render();
	}

	destroyAtlasCharts() {
		if (this.chartManager != null) {
			this.chartManager.destroy();
			delete this.chartManager;
		}
	}

	setThemeColor() {
		var App = this.props.App;
		if (App == null) { return; }
		var $bg = $(React.findDOMNode(this.refs['title-bar__background']));
		var color = App.currentThemeColor;
		if (color != null) {
			$bg.css('background-color', color);
		}
	}

}

}());


