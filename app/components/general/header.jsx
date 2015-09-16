import React from 'react';
import { Link } from 'react-router';
import Icons from './icons.jsx';
import classNames from 'classnames';

class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			stripColor: ''
		};
	}

	render() {
		var NafIcon = Icons.Naf;
		var stripStyle = {
			'backgroundColor': this.state.stripColor
		};
		return (
			<div className={ this.getClass() }>
				<div className="header__corner">
					<Link 
						id="header__welcome-link" 
						to="/welcome" 
					>
						<NafIcon />
					</Link>
				</div>
				<div className="header__main">
					<h1 className="header__main__cursive-prefix"></h1>
					<h1 className="header__main__site-name">ATLAS</h1>
					<p className="header__main__title"></p>
				</div>
				{ this.renderAuth() }
				{ (false) ? <HeaderNavCircles {...this.props} /> : null }
				<div className="header__strip" style={stripStyle} />
			</div>
		);
	}

	renderAuth() {
		var researcher = window.researcher;
		if (!researcher) { return; }
		return (
			<div className="header__auth">
				<img src={researcher.image.url} alt='Researcher Photo'></img>
				<p>{ `Hi, ${researcher.name.givenName}!` }</p>
			</div>
		);
	}

	getClass() {
		return classNames({
			'header': true,
			'bg-c-grey--base': (this.props.theme === 'atlas'),
			'bg-c-naf-green': (this.props.theme === 'naf')
		});
	}

	getHeaderTitle() {
		return this.props.headerTitle;
	}

	componentDidMount() {
		this.setStripHandler();
	}

	setStripHandler() {
		var App = this.props.App;
		if (App == null) { return; }
		App.commands.setHandler('set:header:strip:color', (options) => {
			if (options.color) {
				// reset class to original
				this.setState({ stripColor: options.color });
			} else {
				this.setState({ stripColor: undefined });
			}
		});
	}

}


Header.contextTypes = {
	router: React.PropTypes.func
};


class HeaderNavCircles extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0
		};
	}

	render() {
		return (
			<div className="header__nav-circles">
				<ul className="nav-circles">
					{ this.renderList() }
				</ul>
			</div>
		);
	}

	renderList() {
		return [ 'welcome', 'menu', 'show' ].map((item, i) => {
			var cls = classNames({
				'nav-circle': true,
				'nav-circle--active': (i === 1)
			});
			return (
				<li className={cls} key={i}>
					<a href={ '/' + item } />
				</li>
			);
		});
	}

}


export default Header;