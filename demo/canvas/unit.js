let controller = {
	el:'#xxx',
	canvas: null,
	ctx: null,
	lineWidth:null,
	lastPoint:{
		"x":null,
		"y":null
	},
	newPoint:{
		"x":null,
		"y":null
	},
	historyData:[],
	operatorList:['pen', 'eraser', 'clear', 'undo', 'download'],
	colorList:['#fff', '#000', '#FF3333','#0066FF','#FFFF33','#33CC66','gray'],
	earserEnable:false,
	init(){
		this.canvas = document.querySelector(this.el)
		this.ctx = this.canvas.getContext('2d')
		this.ctx.fillStyle = this.colorList[1]
		this.ctx.strokeStyle = this.colorList[1]
		this.resetCanvasSize()
		this.bindEvents()
	},
	bindEvents(){
		this.penSizeMonitor()
		if (document.body.ontouchstart !== undefined) {
			this.touchMonitor()
		}else{
			this.mouseMonitor()
		}
		this.operatorMonitor()
		this.colorMonitor()
	},
	penSizeMonitor(){
		let sizeDom = document.querySelector('#range')
		sizeDom.onchange = (e) => {
			this.lineWidth = sizeDom.value
		}
	},
	mouseMonitor(){
		this.canvas.onmousedown = (e) => {
			this.firstDot = this.ctx.getImageData(0,0,this.canvas.width, this.canvas.height)
			this.saveData(this.firstDot)
			this.isPainting = true
			let x = e.clientX
			let y = e.clientY
			if(this.earserEnable){
				 this.ctx.clearRect(x - this.lineWidth/2, y - this.lineWidth/2, this.lineWidth, this.lineWidth)
			}
			this.lastPoint = {"x": x, "y": y}
			this.ctx.save()
			this.drawCircle(x, y, 0)
		}

		this.canvas.onmousemove = (e) => {
			if(!this.isPainting){return}
            let x = e.clientX
            let y = e.clientY
			if(this.earserEnable){
				this.ctx.clearRect(x - this.lineWidth/2, y - this.lineWidth/2, this.lineWidth, this.lineWidth)
			}else{
				this.newPoint = {"x": x, "y":y}
				this.drawLine()
				this.lastPoint = this.newPoint
			}
		}

		this.canvas.onmouseup = (e) => {
			this.isPainting = false
		}
	},
	touchMonitor(){
		this.canvas.ontouchstart = (e) => {
			this.firstDot = this.ctx.getImageData(0,0,this.canvas.width, this.canvas.height)
			this.saveData(this.firstDot)
			this.isPainting = true
			let x = e.touches[0].clientX
			let y = e.touches[0].clientY
			if(this.earserEnable){
				 this.ctx.clearRect(x - this.lineWidth/2, y - this.lineWidth/2, this.lineWidth, this.lineWidth)
			}
			this.lastPoint = {"x": x, "y": y}
			this.ctx.save()
			this.drawCircle(x, y, 0)
		}

		this.canvas.ontouchmove = (e) => {
			if(!this.isPainting){return}
			let x = event.touches[0].clientX
			let y = event.touches[0].clientY

			if(this.earserEnable){
				this.ctx.clearRect(x - this.lineWidth/2, y - this.lineWidth/2, this.lineWidth, this.lineWidth)
			}else{
				this.newPoint = {"x": x, "y":y}
				this.drawLine()
				this.lastPoint = this.newPoint
			}
		}
		this.canvas.ontouchend = function(event){
	        this.isPainting = false
	    } 	
	},
	operatorMonitor(){
		$('#actions>li').on('click', (e) => {
			let $li = $(e.currentTarget)
			$li.addClass('active').siblings('.active').removeClass('active')
			let id = $li.attr('id')
			switch(id){
				case 'pen':
				    this.earserEnable = false
				break
				case 'eraser':
				    this.earserEnable = true
				break
				case 'clear':
				    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
				break
				case 'undo':
				    this.undoFunction()
				break
				case 'download':
				    this.downloadImage()
				break
				default:
				break
			}
		})
	},
	colorMonitor(){
		$('#colors>li').on('click', (e) => {
			let $li = $(e.currentTarget)
			$li.addClass('active').siblings('.active').removeClass('active')
			let index = $li.attr('data-index')
			$('#actions>li').eq(0).addClass('active')
			.siblings('.active').removeClass('active')
			this.fillStyle = this.colorList[index]
			this.ctx.fillStyle = this.fillStyle
			this.ctx.strokeStyle = this.fillStyle
		})
	},
	drawLine(){
		let ctx = this.ctx
		ctx.lineWidth = this.lineWidth
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'

		ctx.moveTo(this.lastPoint.x, this.lastPoint.y)
		ctx.lineTo(this.newPoint.x, this.newPoint.y)
		ctx.stroke()
		ctx.closePath()
	},
	drawCircle(x, y, radius){
		let ctx = this.ctx
		ctx.save()
		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI * 2)
		ctx.fill()
	},
	saveData(data){
		(this.historyData.length === 10) && (this.historyData.shift());  // 上限为存储10布
		this.historyData.push(data)
	},
	undoFunction(){
		if(this.historyData.length < 1){
			return false
		}
		this.ctx.putImageData(this.historyData[this.historyData.length - 1], 0, 0)
		this.historyData.pop()
	},
	downloadImage(){
		var url = this.canvas.toDataURL('image/png');
		var a = document.createElement('a');
		document.body.appendChild(a);
		a.href = url;
		a.download = 'xxx';
		a.click();
	},
	resetCanvasSize(){
		this.setCanvasSize()
		window.onreload = () => {
			this.setCanvasSize()
		}
	},
	setCanvasSize(){
		let pageWidth = document.documentElement.clientWidth
		let pageHeight = document.documentElement.clientHeight

		this.canvas.width = pageWidth
		this.canvas.height = pageHeight
	}
}

controller.init()