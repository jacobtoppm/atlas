import React from 'react';
import classNames from 'classnames';
import Slider from './../../../../../general/slider.jsx';
import Icons from './../../../../../general/icons.jsx';

class TopBar extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="atl__top-bar">
				<div className={ this.getContentClassName() }>
					<TopBarIcons {...this.props} />
					{ this.renderTimeline() }
					<div className="atl__top-bar__summary">
						<div><p>{ this.getName() }</p></div>
						<div>
							<div className='button'>
								<p>{ this.getKey() }</p>
							</div>
						</div>
						<div><p>{ this.getValue() }</p></div>
					</div>
				</div>
			</div>
		);
	}

	getContentClassName() {
		return classNames({
			'atl__top-bar__content': true,
		}, this.getBackgroundColorClass());
	}

	renderTimeline() {
		return;
		return (
			<div className="atl__top-bar__timeline">
				<Slider {...this.props} values={[ '2003', '2004', '2005', '2006' ]} />
			</div>
		);
	}

	getName() {
		var hoveredItem = this.getHoveredItem();
		if (hoveredItem == null) { return ''; }
		return hoveredItem.get('name');
	}

	getValue() {
		var hoveredItem = this.getHoveredItem();
		var filter = this.getFilter();
		if (hoveredItem == null || filter == null) { return; }
		var varId = filter.getActiveChild().get('variable').get('id');
		return hoveredItem.get(varId);
	}

	getKey() {
		var filter = this.getFilter();
		return filter.getActiveChild().get('variable').get('display_title');
	}

	getHoveredItem() {
		return this.props.project.get('data').items.hovered;
	}

	getFilter() {
		return this.props.project.get('data').filter;
	}

	getBackgroundColorClass() {
		var hoveredItem, indeces, cls;
		indeces = this.props.project.getFriendlyIndeces();
		if (indeces == null || indeces.length === 0) { return 'bg-c-grey--base'; }
		cls = `bg-c-${indeces[0]}`;
		return cls;
	}

}


class TopBarIcons extends React.Component {

	render() {
		return (
			<div className="atl__top-bar__icons">
				<ul className='icons'>
					{ this.renderIcons() }
				</ul>
			</div>
		);
	}

	getIconData() {
		return [
			{
				id: 'map',
				reactIconName: 'UsMap'
			},
			{
				id: 'info',
				reactIconName: 'Dictionary'
			}
		];
	}

	renderIcons() {
		return this.getIconData().map((icon) => {
			return (
				<TopBarIcon {...this.props} icon={icon} />
			);
		});
	}

}

class TopBarIcon extends React.Component {

	render() {
		var Icon = Icons[this.props.icon.reactIconName];
		return (
			<li className={ 'icons__icon ' + this.getModifierClass() } onClick={this.changeGlobalItemsDisplayMode.bind(this)} >
				<Icon />
			</li>
		);
	}

	changeGlobalItemsDisplayMode() {
		this.props.setUiState({
			itemsDisplayMode: this.props.icon.id
		});
	}

	getModifierClass() {
		if (this.isActive()) { return 'icons__icon--active'; }
		return '';
	}

	isActive() {
		return (this.props.uiState.itemsDisplayMode === this.props.icon.id);
	}

}


export default TopBar;