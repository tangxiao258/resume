{
	let view = {
		el:'.stars',
		render(){
			for(let i = 0; i < 32; i++){
				let size = Math.round((Math.random() * 10)) > 5 ? 'medium' : 'small'
				let top = Math.round(Math.random() * 100)
				let left = Math.round(Math.random() * 100)
				let style = {
					'top':`${top}%`,
					'left':`${left}%`
				}
				let liDom = $('<li></li>').addClass(`star ${size}`).css(style)
				$(this.el).prepend(liDom)
			}
		}
	}

	let model = {}

	let controller = {
		init(view, model){
			this.view = view
			this.model = model
			this.view.render()
		}
	}

	controller.init(view, model)
}