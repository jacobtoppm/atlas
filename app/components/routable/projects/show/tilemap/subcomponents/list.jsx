Comp.Projects.Show.Tilemap.List = class extends React.Component {

	render() {
		return (
			<div className='fill-parent bg-c-off-white'>
				{ this.renderItems() }
			</div>
		);
	}

	renderItems() {
		var project = this.props.project;
		if (project == null) { return; }
		return project.get('data').items.map((item) => {
			return (
				<p>{ item.get('name') }</p>
			);
		});
	}

}