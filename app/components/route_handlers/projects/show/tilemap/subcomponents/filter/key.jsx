import React from 'react'
import classNames from 'classnames'

/*
 *
 *
 */
class FilterKey extends React.Component {

	/*
	 *
	 *
	 */
	render() {
		var cls = classNames({
			'button': 'true',
			'button--active': this.props.filterKey.isActive()
		})
		return (
			<li className={ cls } onClick={ this.toggle.bind(this) }>
				<p>
					{ this.getContent() }
				</p>
			</li>
		)
	}


	/*
	 *
	 *
	 */
	getContent() {
		return this.props.filterKey.get('variable').get('display_title')
	}


	/*
	 *
	 *
	 */
	toggle() {
		var { radio } = this.props
		this.props.filterKey.clickToggle()
		radio.commands.execute('update:tilemap')
	}

}

export default FilterKey