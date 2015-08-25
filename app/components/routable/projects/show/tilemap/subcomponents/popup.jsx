Comp.Projects.Show.Tilemap.Popup = class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			x: 0,
			y: 0,
			display: 'block',
			type: 'state'
		};
	}

	render() {
		var style = { left: this.state.x, top: this.state.y, display: this.state.display };
		return (
			<div className={ 'atl__popup ' + this.getModifierClass() } style={ style }>
				<div className="atl__popup__wrapper">
					<div className="atl__popup__content">
						<div id="atl__popup__content__logo" className="atl__popup__content__logo">
							{ this.renderLogo() }
						</div>
						<div className="atl__popup__content__text">
							<p>{ this.getName() }</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	getModifierClass() {
		if(this.state.type === 'state') { return 'atl__popup--center'; }
		return '';
	}

	componentDidMount() {
		_.extend(this, Backbone.Events);
		var App = this.props.App;
		this.listenTo(App.vent, 'item:mouseover item:mouseout', this.setPosition.bind(this));
	}

	componentWillUnmount() {
		this.stopListening();
	}

	getHoveredItem() {
		return this.props.project.get('data').items.hovered;
	}

	getName() {
		var hoveredItem = this.getHoveredItem();
		if (hoveredItem == null) { return ''; }
		return hoveredItem.get('name');
	}

	renderLogo() {
		return (
			<svg className="hex-button" viewBox="0 0 100 100">
				<g className="hex-button__border">
					<path d="M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2L44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3"/>
				</g>
				<g className="hex-button__down">
					<path d="M61.6,47c1.7-1.7,4.5-1.7,6.2,0c1.7,1.7,1.7,4.5,0,6.2L53.5,67.6l0,0L53.1,68c-0.8,0.8-2,1.3-3.1,1.3c-1.2,0-2.3-0.5-3.1-1.3l-0.3-0.3l0,0L32.2,53.3c-1.7-1.7-1.7-4.5,0-6.2c1.7-1.7,4.5-1.7,6.2,0l7.2,7.2V35.1c0-1.2,0.5-2.3,1.3-3.1c0.8-0.8,1.9-1.3,3.1-1.3c1.2,0,2.3,0.5,3.1,1.3c0.8,0.8,1.3,1.9,1.3,3.1v19.1L61.6,47z"/>
				</g>
			</svg>
		);
	}

	setPosition() {
		var hoveredItem, App, position;
		App = this.props.App;
		if (App == null) { return; }
		hoveredItem = this.getHoveredItem();
		if (hoveredItem == null) { return this.setState({ display: 'none' }); }
		position = App.reqres.request('item:map:position', hoveredItem);
		this.setState({
			x: position.x,
			y: position.y,
			display: 'block',
			type: hoveredItem.get('_itemType')
		});
	}

}