import React from 'react';
import classNames from 'classnames';

class Control extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='atl__map-control'>
				<div onClick={this.showAttribution.bind(this)} className='atl__map-control__button bg-img-info--black'></div> 
				<div onClick={this.zoom.bind(this, +1)} className='atl__map-control__button bg-img-plus--black'></div>
				<div onClick={this.zoom.bind(this, -1)} className='atl__map-control__button bg-img-minus--black'></div>
				<div className='atl__help atl__help--left'>
					View <b>copyright</b> information about the map and <b>zoom</b> in and out.
				</div>
			</div>
		);
	}

	zoom(zoomChange) {
		if (this.props.map) {
			this.props.map.changeZoom(zoomChange);
		}
	}

	showAttribution() {
		$('.leaflet-control-attribution').toggle();
	}

}

export default Control;